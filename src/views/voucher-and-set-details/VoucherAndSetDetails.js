/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import "./VoucherAndSetDetails.scss";
import { useHistory } from "react-router";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";
import * as humanizeDuration from "humanize-duration";
import { HorizontalScrollView } from "rc-horizontal-scroll";

import ShowQR from "../show-qr/ShowQR";
import "./VoucherAndSetDetails.scss";

import {
  useVoucherKernalContract,
  useBosonRouterContract,
  useBosonTokenContract,
} from "../../hooks/useContract";
import { PAYMENT_METHODS, SMART_CONTRACTS_EVENTS } from "../../hooks/configs";
import {
  getVoucherDetails,
  getPaymentsDetails,
  commitToBuy,
  createEvent,
} from "../../hooks/api";
import { getAccountStoredInLocalStorage } from "../../hooks/authenticate";
import { onAttemptToApprove } from "../../hooks/approveWithPermit";

import {
  ROLE,
  OFFER_FLOW_SCENARIO,
  STATUS,
  ROUTE,
  MODAL_TYPES,
  MESSAGE,
} from "../../helpers/configs/Dictionary";
import { capitalize, formatDate } from "../../utils/FormatUtils";
import {
  determineCurrentStatusOfVoucher,
  initVoucherDetails,
} from "../../helpers/parsers/VoucherAndSetParsers";

import LoadingSpinner from "../../shared-components/loading-spinner/LoadingSpinner";
import { ModalResolver } from "../../contexts/Modal";
import { ModalContext } from "../../contexts/Modal";
import { GlobalContext } from "../../contexts/Global";
import { NavigationContext, Action } from "../../contexts/Navigation";

import ContractInteractionButton from "../../shared-components/contract-interaction/contract-interaction-button/ContractInteractionButton";
import PopupMessage from "../../shared-components/popup-message/PopupMessage";
import {
  DateTable,
  TableRow,
  PriceTable,
  DescriptionBlock,
} from "../../shared-components/table-content/TableContent";
import EscrowTable from "./components/escrow-table/EscrowTable";
import {
  IconQRScanner,
  IconWarning,
  IconClock,
} from "../../shared-components/icons/Icons";

import { calculateDifferenceInPercentage } from "../../utils/MathUtils";
import {
  isCorrelationIdAlreadySent,
  setRecentlyUsedCorrelationId,
} from "../../utils/DuplicateCorrelationIdGuard";
import {
  setTxHashToSupplyId,
  waitForRecentTransactionIfSuchExists,
} from "../../utils/BlockchainUtils";

import GenericMessage from "../generic-message/GenericMessage";
import { validateContractInteraction } from "../../helpers/validators/ContractInteractionValidator";

const voucherPlaceholder = (
  <div className="details-loading">
    <div className="title is-loading-2"></div>
    <div className="status-container">
      <div className="h is-loading-2"></div>
      <div className="status-chain flex ai-center">
        <div className="status is-loading-2"></div>
        <div className="status is-loading-2"></div>
        <div className="status is-loading-2"></div>
      </div>
    </div>
    <div className="paytable-loading">
      <div className="h is-loading-2"></div>
      <div className="header is-loading-2"></div>
      <div className="table is-loading-2"></div>
    </div>
    <div className="image is-loading-2"></div>
    <div className="description is-loading-2"></div>
    <div className="table flex split">
      <div className="left is-loading-2"></div>
      <div className="right is-loading-2"></div>
    </div>
    <div className="table flex split">
      <div className="left is-loading-2"></div>
      <div className="right is-loading-2"></div>
    </div>
  </div>
);

const voucherSetPlaceholder = (
  <div className="details-loading voucher-set">
    <div className="title is-loading-2"></div>
    <div className="image is-loading-2"></div>
    <div className="description is-loading-2"></div>
    <div className="table flex split">
      <div className="left is-loading-2"></div>
      <div className="right is-loading-2"></div>
    </div>
    <div className="table l flex split">
      <div className="left is-loading-2"></div>
    </div>
    <div className="table l t flex split">
      <div className="left is-loading-2"></div>
      <div className="right is-loading-2"></div>
    </div>
    <div className="table l flex split">
      <div className="left is-loading-2"></div>
      <div className="right is-loading-2"></div>
    </div>
  </div>
);

function VoucherAndSetDetails(props) {
  const [loading, setLoading] = useState(0);
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [escrowData, setEscrowData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(0);
  const [imageView, setImageView] = useState(0);
  const [pageLoading, setPageLoading] = useState(0);
  const [pageLoadingPlaceholder, setPageLoadingPlaceholder] = useState(
    voucherPlaceholder
  );
  const voucherId = props.match.params.id;
  const modalContext = useContext(ModalContext);
  const globalContext = useContext(GlobalContext);
  const navigationContext = useContext(NavigationContext);
  const bosonRouterContract = useBosonRouterContract();
  const bosonTokenContract = useBosonTokenContract();
  const voucherKernalContract = useVoucherKernalContract();
  const { library, account, chainId } = useWeb3React();
  const history = useHistory();
  const [voucherStatus, setVoucherStatus] = useState();
  const [controls, setControls] = useState();
  const [actionPerformed, setActionPerformed] = useState(1);
  const [popupMessage, setPopupMessage] = useState();
  const [distributionMessage, setDistributionMessage] = useState(false);
  const [recentlySignedTxHash, setRecentlySignedTxHash] = useState("");
  const [
    hideControlButtonsWaitPeriodExpired,
    setHideControlButtonsWaitPeriodExpired,
  ] = useState(false);
  const [disablePage, setDisablePage] = useState(0);
  const [cancelMessage, setCancelMessage] = useState(false);
  const [authenticationCompleted, setAuthenticationCompleted] = useState(false);
  const [transactionProccessing, setTransactionProccessing] = useState(1);

  const voucherSets = globalContext.state.allVoucherSets;
  const voucherSetDetails = voucherSets?.find((set) => set.id === voucherId);

  const getProp = (prop) =>
    voucherSetDetails
      ? voucherSetDetails[prop]
      : voucherDetails
      ? voucherDetails[prop]
      : null;

  const paymentType = getProp("paymentType");
  const currencyResolver = (paymentType) => {
    if (paymentType === PAYMENT_METHODS.ETHETH) {
      return ["ETH", "ETH"];
    } else if (paymentType === PAYMENT_METHODS.ETHBSN) {
      return ["ETH", "BSN"];
    } else if (paymentType === PAYMENT_METHODS.BSNETH) {
      return ["BSN", "ETH"];
    } else {
      return ["BSN", "BSN"];
    }
  };

  const currencies = currencyResolver(paymentType);

  // int on index #2 is the X position of the block
  const tablePrices = [
    ["Payment Price", getProp("price"), currencies[0], 0],
    false,
    ["Buyer’s deposit", getProp("deposit"), currencies[1], 1],
    ["Seller’s deposit", getProp("sellerDeposit"), currencies[1], 1],
  ];
  const tableDate = [
    formatDate(getProp("startDate")),
    formatDate(getProp("expiryDate")),
  ];

  const tableCategory = [["Category", getProp("category")]];

  const tableCondition = [["Condition", capitalize(getProp("condition"))]];

  const confirmAction = (action, text) => {
    const callAction = () => {
      action();
      setPopupMessage(false);
    };
    setPopupMessage({
      text,
      controls: (
        <div className="flex split buttons-pair">
          <div
            className="button gray"
            role="button"
            onClick={() => setPopupMessage(false)}
          >
            BACK
          </div>
          <div
            className="button primary"
            role="button"
            onClick={() => callAction()}
          >
            CONFIRM
          </div>
        </div>
      ),
    });
  };

  const ViewImageFullScreen = () => (
    <div
      className="image-view-overlay flex center"
      onClick={() => setImageView(0)}
    >
      <div className="button-container">
        <div className="container">
          <div
            className="cancel new"
            onClick={() => {
              setImageView(0);
            }}
          >
            <span className="icon"></span>
          </div>
        </div>
      </div>
      <img src={getProp("image")} alt="" />
    </div>
  );

  useEffect(() => {
    if (library && (voucherDetails || voucherSetDetails)) {
      waitForRecentTransactionIfSuchExists(
        library,
        voucherDetails,
        voucherSetDetails,
        setRecentlySignedTxHash
      );
    }
  }, [voucherDetails, voucherSetDetails, library]);
  // assign controlset to statuses
  const controlList = () => {
    setDisablePage(0);
    const CASE = {};

    CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.COMMITED]] = CASE[
      OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.REFUNDED]
    ] = CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.COMPLAINED]] = CASE[
      OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.REDEEMED]
    ] = () => (
      <div
        className="action button cof"
        onClick={() =>
          confirmAction(onCoF, "Are you sure you want to cancel this voucher?")
        }
        role="button"
      >
        Cancel or Fault
      </div>
    );

    CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.COMMITED]] = () => (
      <div className="flex dual split">
        <div
          className="action button refund"
          role="button"
          onClick={() => onRefund()}
        >
          REFUND
        </div>
        <div
          className="action button redeem"
          role="button"
          onClick={() => setShowQRCode(1)}
        >
          <IconQRScanner /> REDEEM
        </div>
        {/* <Link
                    to={ `${ ROUTE.ActivityVouchers }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
                </Link> */}
      </div>
    );

    CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REDEEMED]] = CASE[
      OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.CANCELLED]
    ] = CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REFUNDED]] = () => (
      <div
        className="action button complain"
        role="button"
        onClick={() => onComplain()}
      >
        COMPLAIN
      </div>
    );
    CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.OFFERED]] = CASE[
      OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.OFFERED]
    ] = () => (
      <ContractInteractionButton
        className="action button commit"
        handleClick={() => onCommitToBuy()}
        label={`COMMIT TO BUY ${voucherSetDetails?.price} ${
          currencyResolver(voucherSetDetails?.paymentType)[0]
        }`}
      />
    );

    CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.OFFERED]] = () =>
      voucherSetDetails &&
      voucherSetDetails?.qty > 0 &&
      account?.toLowerCase() ===
        voucherSetDetails.voucherOwner.toLowerCase() ? (
        <div
          className="button cancelVoucherSet"
          onClick={() =>
            confirmAction(
              onCancelOrFaultVoucherSet,
              "Are you sure you want to cancel the voucher set?"
            )
          }
          role="button"
        >
          Void Voucher Set
        </div>
      ) : null;

    CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.DRAFT]] = CASE[
      OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.DRAFT]
    ] = CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.DRAFT]] = () => {
      setTransactionProccessing(transactionProccessing * -1);
      return (
        <div
          className="button cancelVoucherSet"
          role="button"
          style={{ border: "none" }}
          disabled
          onClick={(e) => e.preventDefault()}
        >
          DRAFT: TRANSACTION IS BEING PROCESSED
        </div>
      );
    };

    CASE[OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.DISABLED]] = () => {
      setDisablePage(1);
      setPageLoading(0);
      return null;
    };

    return CASE;
  };

  const determineStatus = ({ checkAuthentication }) => {
    const voucherResource = voucherDetails
      ? voucherDetails
      : voucherSetDetails
      ? voucherSetDetails
      : false;

    const voucherRoles = {
      owner:
        voucherResource?.voucherOwner?.toLowerCase() ===
          account?.toLowerCase() && account,
      holder:
        voucherResource?.holder?.toLowerCase() === account?.toLowerCase() &&
        account,
    };

    const draftStatusCheck = !(
      voucherResource?._tokenIdVoucher || voucherResource?._tokenIdSupply
    );

    const statusPropagate = () =>
      draftStatusCheck
        ? STATUS.DRAFT
        : voucherResource.FINALIZED
        ? STATUS.FINALIZED
        : voucherResource.CANCELLED
        ? !voucherResource.COMPLAINED
          ? STATUS.CANCELLED
          : STATUS.COMPLANED_CANCELED
        : voucherResource.COMPLAINED
        ? STATUS.COMPLAINED
        : voucherResource.REFUNDED
        ? STATUS.REFUNDED
        : voucherResource.REDEEMED
        ? STATUS.REDEEMED
        : voucherResource.COMMITTED
        ? STATUS.COMMITED
        : !voucherResource?.qty
        ? STATUS.VIEW_ONLY
        : !voucherResource.COMMITTED
        ? STATUS.OFFERED
        : false;

    const role = voucherRoles.owner
      ? ROLE.SELLER
      : voucherRoles.holder
      ? ROLE.BUYER
      : ROLE.NON_BUYER_SELLER;
    const status = voucherResource && statusPropagate();

    // don't show actions if:
    const blockActionConditions = [
      new Date() >= new Date(voucherResource?.expiryDate), // voucher expired
      new Date() <= new Date(voucherResource?.startDate) && !!voucherDetails, // has future start date and is voucher
      voucherSetDetails?.qty <= 0, // no quantity
      recentlySignedTxHash !== "",
      hideControlButtonsWaitPeriodExpired,
    ];

    if (
      role === ROLE.NON_BUYER_SELLER &&
      checkAuthentication &&
      !voucherSetDetails
    )
      return OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.DISABLED];

    // status: undefined - user that has not logged in
    return !blockActionConditions.includes(true)
      ? OFFER_FLOW_SCENARIO[role][status]
      : undefined;
  };

  const getControlState = () => {
    const controlResponse = controlList();

    return voucherStatus
      ? controlResponse[voucherStatus] && controlResponse[voucherStatus]()
      : null;
  };
  const [statusBlocks, setStatusBlocks] = useState(voucherDetails ? [] : false);

  const resolveWaitPeriodStatusBox = async (newStatusBlocks) => {
    if (
      voucherDetails &&
      !voucherDetails.FINALIZED &&
      voucherDetails._tokenIdVoucher
    ) {
      if (voucherDetails.COMPLAINED && voucherDetails.CANCELLED) {
        return newStatusBlocks;
      }
      const voucherStatus = await voucherKernalContract.vouchersStatus(
        ethers.BigNumber.from(voucherDetails._tokenIdVoucher)
      );
      const currentStatus = determineCurrentStatusOfVoucher(voucherDetails);

      const complainPeriod = await voucherKernalContract.complainPeriod();
      const cancelFaultPeriod = await voucherKernalContract.cancelFaultPeriod();

      const complainPeriodStart = voucherStatus.complainPeriodStart;
      const cancelFaultPeriodStart = voucherStatus.cancelFaultPeriodStart;

      let waitPeriodStart;
      let waitPeriod;

      if (currentStatus.status === STATUS.EXPIRED) {
        waitPeriodStart = voucherDetails.EXPIRED;
        waitPeriod = complainPeriod;
      } else if (!voucherDetails.CANCELLED && !voucherDetails.COMPLAINED) {
        waitPeriodStart = complainPeriodStart;
        waitPeriod = complainPeriod.add(cancelFaultPeriod);
      } else if (voucherDetails.COMPLAINED) {
        waitPeriodStart = cancelFaultPeriodStart;
        waitPeriod = cancelFaultPeriod;
      } else if (voucherDetails.CANCELLED) {
        waitPeriodStart = complainPeriodStart;
        waitPeriod = complainPeriod;
      }

      if (
        (waitPeriod && waitPeriod.gt(ethers.BigNumber.from("0"))) ||
        currentStatus.status === STATUS.COMMITED
      ) {
        const currentBlockTimestamp = (await library.getBlock()).timestamp;

        const start =
          currentStatus.status === STATUS.COMMITED
            ? new Date(voucherDetails.startDate)
            : new Date(
                +ethers.utils.formatUnits(waitPeriodStart, "wei") * 1000
              );
        const end =
          currentStatus.status === STATUS.COMMITED
            ? new Date(voucherDetails.expiryDate)
            : new Date(
                +ethers.utils.formatUnits(
                  waitPeriodStart.add(waitPeriod),
                  "wei"
                ) * 1000
              );
        const now = new Date(currentBlockTimestamp * 1000);

        const timePast = now?.getTime() / 1000 - start?.getTime() / 1000;
        const timeAvailable =
          voucherDetails && end?.getTime() / 1000 - start?.getTime() / 1000;

        const diffInPercentage = calculateDifferenceInPercentage(
          timePast,
          timeAvailable
        );

        if (!(currentStatus === STATUS.EXPIRED) && diffInPercentage >= 100) {
          setHideControlButtonsWaitPeriodExpired(true);
        }
        const expiryProgress = voucherDetails && diffInPercentage + "%";
        document.documentElement.style.setProperty(
          "--progress-percentage",
          expiryProgress
            ? parseInt(diffInPercentage) > 100
              ? "100%"
              : expiryProgress
            : null
        );

        const statusTitle =
          currentStatus.status === STATUS.COMMITED
            ? "Expiration date"
            : "Wait period";
        return [
          ...newStatusBlocks,
          singleStatusComponent({
            title: statusTitle,
            date: end,
            color: 4,
            progress: expiryProgress,
            status: currentStatus.status,
          }),
        ];
      }
    }
    return newStatusBlocks;
  };

  useEffect(() => {
    if (voucherDetails) {
      const resolveStatusBlocks = async () => {
        let newStatusBlocks = [];
        if (!!voucherDetails) {
          if (voucherDetails.COMMITTED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "COMMITED",
                date: voucherDetails.COMMITTED,
                color: 1,
              })
            );
          if (voucherDetails.REDEEMED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "REDEMPTION SIGNED",
                date: voucherDetails.REDEEMED,
                color: 2,
              })
            );
          if (voucherDetails.REFUNDED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "REFUND TRIGGERED",
                date: voucherDetails.REFUNDED,
                color: 5,
              })
            );
          if (voucherDetails.COMPLAINED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "COMPLAINT MADE",
                date: voucherDetails.COMPLAINED,
                color: 3,
              })
            );
          if (voucherDetails.CANCELLED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "CANCEL OR FAULT ADMITTED",
                date: voucherDetails.CANCELLED,
                color: 4,
              })
            );

          if (newStatusBlocks?.length)
            newStatusBlocks.sort((a, b) => (a.date > b.date ? 1 : -1));

          if (voucherDetails.FINALIZED) {
            newStatusBlocks.push(
              finalStatusComponent(
                !!voucherDetails.REDEEMED,
                !!voucherDetails.COMPLAINED,
                !!voucherDetails.CANCELLED,
                voucherDetails.FINALIZED
              )
            );
          }
        }
        const withWaitPeriodBox = await resolveWaitPeriodStatusBox(
          newStatusBlocks
        );
        setStatusBlocks(withWaitPeriodBox);
      };

      resolveStatusBlocks();
    }
  }, [voucherDetails]);

  const prepareEscrowData = async () => {
    const payments = await getPayments(voucherDetails, account, modalContext);

    let depositsDistributed;
    let paymentDistributed;

    if (payments?.distributedAmounts) {
      depositsDistributed =
        [
          ...Object.values(payments?.distributedAmounts.buyerDeposit),
          ...Object.values(payments?.distributedAmounts.sellerDeposit),
        ].filter((x) => x.hex !== "0x00").length > 0;

      paymentDistributed =
        [...Object.values(payments?.distributedAmounts.payment)].filter(
          (x) => x.hex !== "0x00"
        ).length > 0;
    }

    if (!depositsDistributed && voucherDetails.FINALIZED) {
      setDistributionMessage("Deposits will be distributed in 1 hour");
    }
    if (
      !paymentDistributed &&
      !voucherDetails.FINALIZED &&
      (voucherDetails.REDEEMED || voucherDetails.REFUNDED)
    ) {
      console.log("setting to");
      setDistributionMessage("Payment will be distributed in 1 hour");
    }

    const getPaymentMatrixSet = (row, column) =>
      ethers.utils.formatEther(payments?.distributedAmounts[row][column]);

    const tableMatrixSet = (row) => {
      const positionArray = [];

      if (payments?.distributedAmounts[row]) {
        positionArray.push(Number(getPaymentMatrixSet(row, "buyer")));
        positionArray.push(Number(getPaymentMatrixSet(row, "escrow")));
        positionArray.push(Number(getPaymentMatrixSet(row, "seller")));
      }

      return positionArray;
    };

    const tablePositions = {};

    tablePositions.price = tableMatrixSet("payment");
    tablePositions.buyerDeposit = tableMatrixSet("buyerDeposit");
    tablePositions.sellerDeposit = tableMatrixSet("sellerDeposit");

    // this is to check if the block should be positioned in the escrow column
    Object.entries(tablePositions)?.forEach(
      (entry) =>
        (tablePositions[entry[0]][1] = entry[1].length
          ? entry[1]?.reduce((acc, val) => acc + val)
            ? tablePositions[entry[0]][1]
            : voucherDetails[entry[0]]
          : 0)
    ); // only god can judge me

    return {
      PAYMENT: {
        title: "PAYMENT",
        currency: currencies[0],
        position: tablePositions.price,
      },
      BUYER_DEPOSIT: {
        title: "BUYER DEPOSIT",
        currency: currencies[1],
        position: tablePositions.buyerDeposit,
      },
      SELLER_DEPOSIT: {
        title: "SELLER DEPOSIT",
        currency: currencies[1],
        position: tablePositions.sellerDeposit,
      },
    };
  };

  async function getPayments() {
    if (!account) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "Please connect your wallet account",
        })
      );
      return;
    }

    const authData = getAccountStoredInLocalStorage(account);

    try {
      return await getPaymentsDetails(voucherDetails.id, authData.authToken);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message,
        })
      );
    }
  }

  async function onCommitToBuy() {
    if (!library || !account) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "Please connect your wallet account",
        })
      );
      return;
    }

    const voucherSetInfo = voucherSetDetails;

    if (voucherSetInfo.voucherOwner.toLowerCase() === account.toLowerCase()) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "The connected account is the owner of the voucher set",
        })
      );
      return;
    }

    const price = ethers.utils.parseEther(voucherSetInfo.price).toString();
    const buyerDeposit = ethers.utils.parseEther(voucherSetInfo.deposit);
    const supplyId = voucherSetInfo._tokenIdSupply;
    const owner = voucherSetInfo.voucherOwner.toLowerCase();

    const authData = getAccountStoredInLocalStorage(account);
    let correlationId;

    setLoading(1);

    try {
      correlationId = (
        await bosonRouterContract.correlationIds(account)
      ).toString();

      const correlationIdRecentlySent = isCorrelationIdAlreadySent(
        correlationId,
        account
      );

      if (correlationIdRecentlySent) {
        modalContext.dispatch(
          ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content:
              "Please wait for your recent transaction to be minted before sending another one.",
          })
        );
        setLoading(0);
        return;
      }

      const tx = await commitToBuyTransactionCreator(
        bosonRouterContract,
        supplyId,
        voucherSetInfo,
        price,
        buyerDeposit,
        bosonTokenContract,
        library,
        account,
        chainId,
        modalContext
      );
      if (!tx) {
        setLoading(0);
        return;
      }

      setRecentlyUsedCorrelationId(correlationId, account);
      setRecentlySignedTxHash(tx.hash, supplyId);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message,
        })
      );
      setLoading(0);
      return;
    }

    try {
      const metadata = {
        _holder: account,
        _issuer: owner,
        _tokenIdSupply: supplyId,
        _correlationId: correlationId,
      };

      await commitToBuy(voucherSetInfo.id, metadata, authData.authToken);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message,
        })
      );
      setLoading(0);
      return;
    }

    try {
      const eventData = {
        name: SMART_CONTRACTS_EVENTS.LOG_VOUCHER_DELIVERED,
        _correlationId: correlationId,
      };
      await createEvent(eventData, authData.authToken);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Logging of the smart contract event failed. This does not affect committing your voucher.",
        })
      );
    }

    setLoading(0);
    setActionPerformed(actionPerformed * -1);
    history.push(ROUTE.ActivityVouchers);
  }

  async function onComplain() {
    if (!library || !account) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "Please connect your wallet account",
        })
      );
      return;
    }

    const authData = getAccountStoredInLocalStorage(account);

    if (!authData.activeToken) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Please check your wallet for Signature Request. Once the authentication message is signed you can proceed.",
        })
      );
      return;
    }

    setLoading(1);

    try {
      const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
        bosonRouterContract,
        "complain",
        [voucherDetails._tokenIdVoucher]
      );

      if (
        contractInteractionDryRunErrorMessageMaker({
          action: "Complain",
          account,
        })
      ) {
        modalContext.dispatch(
          ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content: contractInteractionDryRunErrorMessageMaker({
              action: "Complain",
              account,
            }),
          })
        );
        setLoading(0);
        return;
      }

      const tx = await bosonRouterContract.complain(
        voucherDetails._tokenIdVoucher
      );
      setTxHashToSupplyId(tx.hash, voucherDetails._tokenIdVoucher);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message + " :233",
        })
      );
      setLoading(0);
      return;
    }

    try {
      const eventData = {
        name: SMART_CONTRACTS_EVENTS.LOG_VOUCHER_COMPLAIN,
        _tokenId: voucherDetails._tokenIdVoucher,
      };
      await createEvent(eventData, authData.authToken);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Logging of the smart contract event failed. This does not affect compliant of your voucher.",
        })
      );
    }

    setLoading(0);
    setActionPerformed(actionPerformed * -1);
    history.push(ROUTE.ActivityVouchers + "/" + voucherId + "/details");
  }

  async function onRefund() {
    if (!library || !account) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "Please connect your wallet account",
        })
      );
      return;
    }

    const authData = getAccountStoredInLocalStorage(account);

    if (!authData.activeToken) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Please check your wallet for Signature Request. Once the authentication message is signed you can proceed.",
        })
      );
      return;
    }

    setLoading(1);

    try {
      const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
        bosonRouterContract,
        "refund",
        [voucherDetails._tokenIdVoucher]
      );

      if (
        contractInteractionDryRunErrorMessageMaker({
          action: "Refund",
          account,
        })
      ) {
        modalContext.dispatch(
          ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content: contractInteractionDryRunErrorMessageMaker({
              action: "Refund",
              account,
            }),
          })
        );
        setLoading(0);
        return;
      }

      const tx = await bosonRouterContract.refund(
        voucherDetails._tokenIdVoucher
      );
      setTxHashToSupplyId(tx.hash, voucherDetails._tokenIdVoucher);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message + " :233",
        })
      );
      setLoading(0);
      return;
    }

    try {
      const eventData = {
        name: SMART_CONTRACTS_EVENTS.LOG_VOUCHER_REFUNDED,
        _tokenId: voucherDetails._tokenIdVoucher,
      };

      await createEvent(eventData, authData.authToken);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Logging of the smart contract event failed. This does not affect refunding of your voucher.",
        })
      );
    }
    setLoading(0);
    setActionPerformed(actionPerformed * -1);
    history.push(ROUTE.ActivityVouchers + "/" + voucherId + "/details");
  }

  async function onCoF() {
    if (!library || !account) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "Please connect your wallet account",
        })
      );
      return;
    }

    const authData = getAccountStoredInLocalStorage(account);

    if (!authData.activeToken) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Please check your wallet for Signature Request. Once the authentication message is signed you can proceed.",
        })
      );
      return;
    }

    setLoading(1);

    try {
      const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
        bosonRouterContract,
        "cancelOrFault",
        [voucherDetails._tokenIdVoucher]
      );

      if (
        contractInteractionDryRunErrorMessageMaker({
          action: "Cancel or Fault",
          account,
        })
      ) {
        modalContext.dispatch(
          ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content: contractInteractionDryRunErrorMessageMaker({
              action: "Cancel or Fault",
              account,
            }),
          })
        );
        setLoading(0);
        return;
      }

      const tx = await bosonRouterContract.cancelOrFault(
        voucherDetails._tokenIdVoucher
      );
      setTxHashToSupplyId(tx.hash, voucherDetails._tokenIdVoucher);

      setCancelMessage({
        messageType: MESSAGE.SUCCESS,
        title: "The voucher was cancelled",
        link: ROUTE.Activity + "/" + voucherDetails.id + "/details",
        setMessageType: cancelMessageCloseButton,
        subprops: { refresh: true },
      });
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message + " :233",
        })
      );

      setCancelMessage({
        messageType: MESSAGE.ERROR,
        title: "Error cancelation",
        text: "The voucher has not been cancelled, please try again",
        link: ROUTE.Activity + "/" + voucherDetails.id + "/details",
        setMessageType: cancelMessageCloseButton,
        subprops: { refresh: false },
      });

      setLoading(0);
      return;
    }

    try {
      const eventData = {
        name: SMART_CONTRACTS_EVENTS.LOG_VOUCHER_CANCEL_FAULT,
        _tokenId: voucherDetails._tokenIdVoucher,
      };
      await createEvent(eventData, authData.authToken);
    } catch (error) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Logging of the smart contract event failed. This does not affect cancelling of your voucher.",
        })
      );
    }

    setLoading(0);
    setActionPerformed(actionPerformed * -1);
  }

  useEffect(() => {
    setVoucherStatus(determineStatus({ checkAuthentication: false }));

    const authentication = setTimeout(() => {
      setVoucherStatus(determineStatus({ checkAuthentication: true }));
      setAuthenticationCompleted(1);
    }, 500);

    return () => clearTimeout(authentication);
  }, [
    voucherDetails,
    voucherSetDetails,
    account,
    actionPerformed,
    library,
    recentlySignedTxHash,
    hideControlButtonsWaitPeriodExpired,
  ]);

  useEffect(() => {
    if (voucherDetails) setEscrowData(prepareEscrowData());
    setControls(getControlState());
  }, [
    voucherStatus,
    voucherDetails,
    account,
    library,
    recentlySignedTxHash,
    hideControlButtonsWaitPeriodExpired,
  ]);

  useEffect(() => {
    if (!voucherSetDetails && account && globalContext.state.allVoucherSets) {
      initVoucherDetails(
        account,
        modalContext,
        getVoucherDetails,
        voucherId
      ).then((result) => {
        setVoucherDetails(result);
      });
    }
  }, [account, actionPerformed, globalContext.state.allVoucherSets]);

  useEffect(() => {
    setTransactionProccessing(transactionProccessing * -1);
    navigationContext.dispatch(
      Action.setRedemptionControl({
        controls: controls
          ? controls
          : recentlySignedTxHash
          ? [
              <div
                className="button cancelVoucherSet"
                role="button"
                style={{ border: "none" }}
                disabled
                onClick={(e) => e.preventDefault()}
              >
                <div>
                  <span
                    style={{ verticalAlign: "middle", display: "inline-block" }}
                  >
                    <IconClock color={"#E49043"} />
                  </span>
                  <span
                    style={{
                      verticalAlign: "middle",
                      display: "inline-block",
                      fontSize: "1.1em",
                    }}
                  >
                    &nbsp;PENDING
                  </span>
                </div>
              </div>,
            ]
          : null,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, account, library]);

  useEffect(() => {
    const statusChildren = document.getElementById("horizontal-view-container");
    if (
      voucherStatus?.split(":")[0] !== ROLE.NON_BUYER_SELLER &&
      statusBlocks &&
      statusBlocks?.length &&
      statusChildren?.children[1]
    ) {
      const updateScrollerToBeOnTheRightMostStatus = () => {
        document.getElementById(
          "horizontal-view-container"
        ).children[1].scrollLeft = 20000;
      };

      updateScrollerToBeOnTheRightMostStatus();
    }
  }, [voucherStatus && statusBlocks]);

  const cancelMessageCloseButton = (val, props) => {
    setCancelMessage(val);
    if (props.refresh) window.location.reload();
  };

  const onCancelOrFaultVoucherSet = async () => {
    const authData = getAccountStoredInLocalStorage(account);

    if (!authData.activeToken) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Please check your wallet for Signature Request. Once the authentication message is signed you can proceed.",
        })
      );
      return;
    }

    setLoading(1);

    try {
      const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
        bosonRouterContract,
        "requestCancelOrFaultVoucherSet",
        [voucherSetDetails._tokenIdSupply]
      );

      if (
        contractInteractionDryRunErrorMessageMaker({
          action: "Cancel or Fault",
          account,
        })
      ) {
        modalContext.dispatch(
          ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content: contractInteractionDryRunErrorMessageMaker({
              action: "Cancel or Fault",
              account,
            }),
          })
        );
        setLoading(0);
        return;
      }
    } catch (e) {
      ModalResolver.showModal({
        show: true,
        type: MODAL_TYPES.GENERIC_ERROR,
        content: e.message,
      });

      setCancelMessage({
        messageType: MESSAGE.ERROR,
        title: "Error cancelation",
        text: "The set of vouchers has not been cancelled, please try again.",
        link: ROUTE.Activity + "/" + voucherSetDetails.id + "/details",
        setMessageType: cancelMessageCloseButton,
        subprops: { refresh: false },
      });
      setLoading(0);
      return;
    }

    try {
      const tx = await bosonRouterContract.requestCancelOrFaultVoucherSet(
        voucherSetDetails._tokenIdSupply
      );
      setTxHashToSupplyId(tx.hash, voucherSetDetails._tokenIdSupply);

      setCancelMessage({
        messageType: MESSAGE.SUCCESS,
        title: "The voucher set was cancelled",
        text:
          "The vouchers have been cancelled, except the ones that were committed.",
        link: ROUTE.Activity + "/" + voucherSetDetails.id + "/details",
        setMessageType: cancelMessageCloseButton,
        subprops: { refresh: true },
      });
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message,
        })
      );
      setLoading(0);
      return;
    }

    try {
      const metadata = {
        name: SMART_CONTRACTS_EVENTS.LOG_CANCEL_FAULT_VOUCHER_SET,
        _tokenId: voucherSetDetails._tokenIdSupply,
      };
      await createEvent(metadata, authData.authToken);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Logging of the smart contract event failed. This does not affect voiding of your voucher-set.",
        })
      );
    }
    setLoading(0);
  };

  useEffect(() => {
    if (voucherSetDetails) setPageLoading(0);
    escrowData &&
      escrowData.then((res) => {
        if (res && statusBlocks && authenticationCompleted) setPageLoading(0);
      });
  }, [
    voucherStatus,
    statusBlocks,
    escrowData,
    voucherSetDetails,
    voucherDetails,
    authenticationCompleted,
    transactionProccessing,
  ]);

  useEffect(() => {
    const isNotVoucherSet =
      "/" + window.location.pathname.split("/")[1] === ROUTE.ActivityVouchers;

    if (isNotVoucherSet) {
      setPageLoading(1);
    } else {
      setPageLoadingPlaceholder(voucherSetPlaceholder);
      setPageLoading(!voucherSetDetails);
    }
    // setPageLoadingPlaceholder(voucherSetPlaceholder)
  }, []);

  return (
    <>
      {loading ? <LoadingSpinner /> : null}
      {cancelMessage ? <GenericMessage {...cancelMessage} /> : null}
      {<PopupMessage {...popupMessage} />}
      {pageLoading ? pageLoadingPlaceholder : null}
      {!disablePage ? (
        <section
          className="voucher-details no-bg"
          style={{ display: !pageLoading ? "block" : "none" }}
        >
          {showQRCode ? (
            <ShowQR
              setShowQRCode={setShowQRCode}
              voucherId={voucherDetails?.id}
            />
          ) : null}
          {imageView ? <ViewImageFullScreen /> : null}
          <div className="container erase">
            <div className="content">
              <div className="section title">
                <h1>{getProp("title")}</h1>
              </div>
              {!voucherSetDetails &&
              voucherStatus?.split(":")[0] !== ROLE.NON_BUYER_SELLER &&
              statusBlocks ? (
                <div className="section status">
                  <h2>Status</h2>
                  <div
                    className="status-container flex"
                    id="horizontal-view-container"
                  >
                    <HorizontalScrollView
                      items={statusBlocks}
                      ItemComponent={({ item }) => item.jsx}
                      defaultSpace="0"
                      spaceBetweenItems="8px"
                      moveSpeed={1}
                    />
                  </div>
                </div>
              ) : null}
              {!voucherSetDetails &&
              voucherStatus?.split(":")[0] !== ROLE.NON_BUYER_SELLER ? (
                <div className="section escrow">
                  {escrowData ? <EscrowTable escrowData={escrowData} /> : null}
                </div>
              ) : null}

              {distributionMessage ? (
                <div className="section depositsWarning flex center">
                  <IconWarning /> <span> {distributionMessage}</span>{" "}
                </div>
              ) : null}

              <div className="section info">
                <div className="section description">
                  {
                    <DescriptionBlock
                      toggleImageView={setImageView}
                      voucherSetDetails={voucherSetDetails}
                      getProp={getProp}
                    />
                  }
                </div>
                <div className="section category"></div>
                <div className="section general">
                  {/* { tableLocation ? <TableLocation data={ tableLocation }/> : null } */}
                  {getProp("category") ? (
                    <TableRow data={tableCategory} />
                  ) : null}
                  {getProp("condition") ? (
                    <TableRow data={tableCondition} />
                  ) : null}
                </div>
                {voucherSetDetails ? (
                  <div className="section price">
                    {tablePrices.some((item) => item) ? (
                      <PriceTable
                        paymentType={paymentType}
                        data={tablePrices}
                      />
                    ) : null}
                  </div>
                ) : null}
                <div className="section date">
                  {tableDate.some((item) => item) ? (
                    <DateTable data={tableDate} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <GenericMessage
          subprops={{ button: "HOME PAGE" }}
          messageType={MESSAGE.LOCKED}
          title="Invalid link"
          link={ROUTE.Home}
        />
      )}
    </>
  );
}

function singleStatusComponent({ title, date, color, progress, status }) {
  const jsx = (
    <div key={title} className={`status-block color_${color}`}>
      <h3 className="status-name">
        {title}
        {progress ? <div className="progress"></div> : null}
      </h3>
      <p className="status-details">
        {!progress || (progress && status === STATUS.COMMITED)
          ? formatDate(date, "string")
          : `${
              new Date(date).getTime() - new Date().getTime() > 0
                ? humanizeDuration(
                    new Date(date).getTime() - new Date().getTime(),
                    {
                      round: true,
                      largest: 1,
                    }
                  )
                : "Finished"
            }`}
      </p>
    </div>
  );
  return { jsx, date };
}

function finalStatusComponent(
  hasBeenRedeemed,
  hasBeenComplained,
  hasBeenCancelOrFault,
  expiredDate
) {
  const jsx = (
    <div className={`status-block`}>
      <div className="final-status-container">
        {hasBeenRedeemed ? (
          <h3 className="status-name color_1">REDEMPTION</h3>
        ) : (
          <h3 className="status-name color_2">NO REDEMPTION</h3>
        )}
        {hasBeenComplained ? (
          <h3 className="status-name color_3">COMPLAINT</h3>
        ) : (
          <h3 className="status-name color_4">NO COMPLAINT</h3>
        )}
        {hasBeenCancelOrFault ? (
          <h3 className="status-name color_5">CANCEL/FAULT</h3>
        ) : (
          <h3 className="status-name color_6">NO CANCEL/FAULT</h3>
        )}
      </div>
      <p className="status-details">{`Finalised on ${formatDate(
        expiredDate,
        "string"
      )}`}</p>
    </div>
  );
  return { jsx, date: expiredDate };
}

export default VoucherAndSetDetails;

const commitToBuyTransactionCreator = async (
  bosonRouterContract,
  supplyId,
  voucherSetInfo,
  price,
  buyerDeposit,
  tokenContract,
  library,
  account,
  chainId,
  modalContext
) => {
  const paymentType = voucherSetInfo.paymentType;

  const tokensBalance = await tokenContract.balanceOf(account);
  const ethBalance = await tokenContract.provider.getBalance(account);

  if (paymentType === PAYMENT_METHODS.ETHETH) {
    const txValue = ethers.BigNumber.from(price).add(buyerDeposit);

    if (ethBalance.lt(txValue)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough ETH to execute this transaction.",
        })
      );
      return;
    }

    const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
      bosonRouterContract,
      "requestVoucherETHETH",
      [
        supplyId,
        voucherSetInfo.voucherOwner,
        {
          value: txValue.toString(),
        },
      ]
    );

    if (
      contractInteractionDryRunErrorMessageMaker({ action: "Commit", account })
    ) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: contractInteractionDryRunErrorMessageMaker({
            action: "Commit",
            account,
          }),
        })
      );
      return;
    }

    return bosonRouterContract.requestVoucherETHETH(
      supplyId,
      voucherSetInfo.voucherOwner,
      {
        value: txValue.toString(),
      }
    );
  } else if (paymentType === PAYMENT_METHODS.ETHBSN) {
    const txValue = ethers.BigNumber.from(price);
    const tokensDeposit = ethers.BigNumber.from(buyerDeposit);

    if (ethBalance.lt(txValue)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough ETH to execute this transaction.",
        })
      );
      return;
    }

    if (tokensBalance.lt(tokensDeposit)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough BSN to execute this transaction.",
        })
      );
      return;
    }

    //ToDo: Split functionality in two step, first sign, then send tx
    const signature = await onAttemptToApprove(
      tokenContract,
      library,
      account,
      chainId,
      tokensDeposit
    );

    const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
      bosonRouterContract,
      "requestVoucherETHTKNWithPermit",
      [
        supplyId,
        voucherSetInfo.voucherOwner,
        tokensDeposit.toString(),
        signature.deadline,
        signature.v,
        signature.r,
        signature.s,
        { value: txValue },
      ]
    );

    if (
      contractInteractionDryRunErrorMessageMaker({ action: "Commit", account })
    ) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: contractInteractionDryRunErrorMessageMaker({
            action: "Commit",
            account,
          }),
        })
      );
      return;
    }

    return bosonRouterContract.requestVoucherETHTKNWithPermit(
      supplyId,
      voucherSetInfo.voucherOwner,
      tokensDeposit.toString(),
      signature.deadline,
      signature.v,
      signature.r,
      signature.s,
      { value: txValue.toString() }
    );
  } else if (paymentType === PAYMENT_METHODS.BSNBSN) {
    const tokensTxValue = ethers.BigNumber.from(price).add(buyerDeposit);

    if (tokensBalance.lt(tokensTxValue)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough BSN to execute this transaction.",
        })
      );
      return;
    }

    //ToDo: Split functionality in two step, first sign, then send tx
    const signature = await onAttemptToApprove(
      tokenContract,
      library,
      account,
      chainId,
      tokensTxValue
    );

    const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
      bosonRouterContract,
      "requestVoucherTKNTKNSameWithPermit",
      [
        supplyId,
        voucherSetInfo.voucherOwner,
        tokensTxValue.toString(),
        signature.deadline,
        signature.v,
        signature.r,
        signature.s,
      ]
    );

    if (
      contractInteractionDryRunErrorMessageMaker({ action: "Commit", account })
    ) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: contractInteractionDryRunErrorMessageMaker({
            action: "Commit",
            account,
          }),
        })
      );
      return;
    }

    return bosonRouterContract.requestVoucherTKNTKNSameWithPermit(
      supplyId,
      voucherSetInfo.voucherOwner,
      tokensTxValue.toString(),
      signature.deadline,
      signature.v,
      signature.r,
      signature.s
    );
  } else if (paymentType === PAYMENT_METHODS.BSNETH) {
    const txValue = ethers.BigNumber.from(buyerDeposit);
    const tokensDeposit = ethers.BigNumber.from(price);

    if (ethBalance.lt(txValue)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough ETH to execute this transaction.",
        })
      );
      return;
    }

    if (tokensBalance.lt(tokensDeposit)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough BSN to execute this transaction.",
        })
      );
      return;
    }

    //ToDo: Split functionality in two step, first sign, then send tx
    const signature = await onAttemptToApprove(
      tokenContract,
      library,
      account,
      chainId,
      tokensDeposit
    );

    const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
      bosonRouterContract,
      "requestVoucherTKNETHWithPermit",
      [
        supplyId,
        voucherSetInfo.voucherOwner,
        tokensDeposit.toString(),
        signature.deadline,
        signature.v,
        signature.r,
        signature.s,
        { value: txValue.toString() },
      ]
    );

    if (
      contractInteractionDryRunErrorMessageMaker({ action: "Commit", account })
    ) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: contractInteractionDryRunErrorMessageMaker({
            action: "Commit",
            account,
          }),
        })
      );
      return;
    }

    return bosonRouterContract.requestVoucherTKNETHWithPermit(
      supplyId,
      voucherSetInfo.voucherOwner,
      tokensDeposit.toString(),
      signature.deadline,
      signature.v,
      signature.r,
      signature.s,
      { value: txValue.toString() }
    );
  } else {
    console.error(`Payment type not found ${paymentType}`);
    throw new Error("Something went wrong");
  }
};
