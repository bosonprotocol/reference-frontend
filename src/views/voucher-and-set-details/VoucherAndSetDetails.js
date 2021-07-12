/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import "./VoucherAndSetDetails.scss";
import "../../styles/PendingButton.scss";
import { useHistory } from "react-router";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";
import { HorizontalScrollView } from "rc-horizontal-scroll";

import ShowQR from "../show-qr/ShowQR";
import "./VoucherAndSetDetails.scss";

import {
  useBosonRouterContract,
  useBosonTokenContract,
} from "../../hooks/useContract";
import { PAYMENT_METHODS, SMART_CONTRACTS_EVENTS } from "../../hooks/configs";
import { getVoucherDetails, commitToBuy, createEvent } from "../../hooks/api";
import { getAccountStoredInLocalStorage } from "../../hooks/authenticate";
import { onAttemptToApprove } from "../../hooks/approveWithPermit";

import {
  ROLE,
  ROUTE,
  MODAL_TYPES,
  MESSAGE,
} from "../../helpers/configs/Dictionary";
import { capitalize, formatDate } from "../../utils/FormatUtils";
import { initVoucherDetails } from "../../helpers/parsers/VoucherAndSetParsers";

import LoadingSpinner from "../../shared-components/loading-spinner/LoadingSpinner";
import { ModalResolver } from "../../contexts/Modal";
import { ModalContext } from "../../contexts/Modal";
import { Action, GlobalContext } from "../../contexts/Global";
import { NavigationContext, NavigationAction } from "../../contexts/Navigation";
import PopupMessage from "../../shared-components/popup-message/PopupMessage";
import {
  DateTable,
  TableRow,
  TableLocation,
  PriceTable,
  DescriptionBlock,
  ImageBlock,
} from "../../shared-components/table-content/TableContent";
import EscrowTable from "./components/escrow-table/EscrowTable";
import { IconWarning } from "../../shared-components/icons/Icons";

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
import { getControlList } from "./ControlListProvider";
import { useVoucherStatusBlocks } from "../../hooks/useVoucherStatusBlocks";
import { getEscrowData } from "./EscrowDataProvider";
import {
  voucherPlaceholder,
  voucherSetPlaceholder,
} from "../../constants/PlaceHolders";
import { determineRoleAndStatusOfVoucherResourse } from "./RoleAndStatusCalculator";
import FullScreenImage from "../../shared-components/full-screen-image/FullScreenImage";
import PendingButton from "./components/escrow-table/PendingButton";

import { ChainIdError } from "./../../errors/ChainIdError";

function VoucherAndSetDetails(props) {
  const [loading, setLoading] = useState(0);
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [escrowData, setEscrowData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(0);
  const [imageView, setImageView] = useState(0);
  const [pageLoading, setPageLoading] = useState(0);
  const [pageLoadingPlaceholder, setPageLoadingPlaceholder] =
    useState(voucherPlaceholder);
  const voucherId = props.match.params.id;
  const modalContext = useContext(ModalContext);
  const globalContext = useContext(GlobalContext);
  const navigationContext = useContext(NavigationContext);
  const bosonRouterContract = useBosonRouterContract();
  const bosonTokenContract = useBosonTokenContract();
  const voucherControls = navigationContext.state.redemptionFlowControl;
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

  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageType, setSuccessMessageType] = useState("");

  const [triggerWaitForTransaction, setTriggerWaitForTransaction] =
    useState(false);

  const voucherSets = globalContext.state.allVoucherSets;
  const voucherSetDetails = voucherSets?.find((set) => set.id === voucherId);
  const statusBlocks = useVoucherStatusBlocks(
    voucherDetails,
    setHideControlButtonsWaitPeriodExpired,
    true
  );

  const resetSuccessMessage = () => {
    setSuccessMessage("");
    setSuccessMessageType("");
    const messageType = localStorage.getItem("successMessageType");
    localStorage.removeItem("successMessage");
    localStorage.removeItem("successMessageType");
    if (messageType === MESSAGE.COMMIT_SUCCESS) {
      history.push(ROUTE.ActivityVouchers);
      return;
    }
    window.location.reload();
  };

  const getProp = (prop) =>
    voucherSetDetails
      ? voucherSetDetails[prop]
      : voucherDetails
      ? voucherDetails[prop]
      : null;

  useEffect(() => {
    if (recentlySignedTxHash) {
      const backButton = document.getElementById("topNavBackButton");
      if (backButton) {
        backButton.style.cssText += "pointer-events: none; opacity: 0.2";
      }
    }
  }, [recentlySignedTxHash]);

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
    // ["Payment Price", getProp("price"), currencies[0], 0],
    // false,
    ["Buyer’s deposit", getProp("deposit"), currencies[1], 1],
    ["Seller’s deposit", getProp("sellerDeposit"), currencies[1], 1],
  ];
  const tableDate = [
    formatDate(getProp("startDate")),
    formatDate(getProp("expiryDate")),
  ];

  const location = getProp("location");
  const tableLocation = [
    location?.addressLineOne,
    location?.addressLineTwo,
    location?.city,
    location?.postcode,
    location?.country,
  ];

  const tableCategory = [["Category", getProp("category")]];

  const tableCondition = [["Condition", capitalize(getProp("condition"))]];

  const confirmAction = (action, text) => {
    const callAction = () => {
      setPopupMessage(false);
      action();
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

  useEffect(() => {
    if (library && (voucherDetails || voucherSetDetails)) {
      waitForRecentTransactionIfSuchExists(
        library,
        voucherDetails,
        voucherSetDetails,
        setRecentlySignedTxHash,
        setSuccessMessage,
        setSuccessMessageType,
        setTriggerWaitForTransaction
      );
    }
  }, [voucherDetails, voucherSetDetails, library, triggerWaitForTransaction]);

  const getControlState = () => {
    const controlResponse = getControlList(
      setDisablePage,
      setShowQRCode,
      confirmAction,
      onCoF,
      onRefund,
      onComplain,
      onCommitToBuy,
      currencyResolver,
      voucherSetDetails,
      onCancelOrFaultVoucherSet,
      account,
      setTransactionProccessing,
      transactionProccessing,
      setPageLoading,
      successMessage
    );

    return voucherStatus
      ? controlResponse[voucherStatus] && controlResponse[voucherStatus]()
      : null;
  };

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

    if (voucherSetInfo?.voucherOwner.toLowerCase() === account?.toLowerCase()) {
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
      // 4 is Rinkeby chainId. This is a Rinkeby application.
      if (chainId !== 4) {
        throw new ChainIdError();
      }

      correlationId = (
        await bosonRouterContract.getCorrelationId(account)
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
              "Please wait for your recent transaction to be minted before sending another one. If the issue persists go to Wallet -> Advanced.",
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

      localStorage.setItem("successMessage", "Commit triggered");
      localStorage.setItem("successMessageType", MESSAGE.COMMIT_SUCCESS);
      setTxHashToSupplyId(tx.hash, supplyId);
      setRecentlyUsedCorrelationId(correlationId, account);
      setTriggerWaitForTransaction(true);
    } catch (e) {
      console.log("ERROR", e);
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

    globalContext.dispatch(Action.reduceVoucherSetQuantity(voucherSetInfo.id));

    setLoading(0);
    setActionPerformed(actionPerformed * -1);
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
      // 4 is Rinkeby chainId. This is a Rinkeby application.
      if (chainId !== 4) {
        throw new ChainIdError();
      }

      const contractInteractionDryRunErrorMessageMaker =
        await validateContractInteraction(bosonRouterContract, "complain", [
          voucherDetails._tokenIdVoucher,
        ]);

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

      localStorage.setItem("successMessage", "Complain triggered");
      localStorage.setItem("successMessageType", MESSAGE.COMPLAIN_SUCCESS);
      setTxHashToSupplyId(tx.hash, voucherDetails._tokenIdVoucher);
      setTriggerWaitForTransaction(true);
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
      // 4 is Rinkeby chainId. This is a Rinkeby application.
      if (chainId !== 4) {
        throw new ChainIdError();
      }

      const contractInteractionDryRunErrorMessageMaker =
        await validateContractInteraction(bosonRouterContract, "refund", [
          voucherDetails._tokenIdVoucher,
        ]);

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

      localStorage.setItem("successMessage", "Refund triggered");
      localStorage.setItem("successMessageType", MESSAGE.REFUND_SUCCESS);
      setTxHashToSupplyId(tx.hash, voucherDetails._tokenIdVoucher);
      setTriggerWaitForTransaction(true);
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
      // 4 is Rinkeby chainId. This is a Rinkeby application.
      if (chainId !== 4) {
        throw new ChainIdError();
      }

      const contractInteractionDryRunErrorMessageMaker =
        await validateContractInteraction(
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
      setTriggerWaitForTransaction(true);
      localStorage.setItem("successMessage", "Cancel/fault triggered");
      localStorage.setItem("successMessageType", MESSAGE.COF_SUCCESS);
    } catch (e) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message,
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
    setVoucherStatus(
      determineRoleAndStatusOfVoucherResourse(
        false,
        account,
        voucherDetails,
        voucherSetDetails,
        recentlySignedTxHash,
        hideControlButtonsWaitPeriodExpired
      )
    );

    const authentication = setTimeout(() => {
      setVoucherStatus(
        determineRoleAndStatusOfVoucherResourse(
          true,
          account,
          voucherDetails,
          voucherSetDetails,
          recentlySignedTxHash,
          hideControlButtonsWaitPeriodExpired
        )
      );
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
    if (voucherDetails)
      setEscrowData(
        getEscrowData(
          voucherDetails,
          account,
          modalContext,
          setDistributionMessage,
          currencies,
          getAccountStoredInLocalStorage
        )
      );
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
    if (!voucherSetDetails && account) {
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
      NavigationAction.setRedemptionControl({
        controls:
          controls && !triggerWaitForTransaction
            ? controls
            : recentlySignedTxHash || triggerWaitForTransaction
            ? [<PendingButton />]
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
      // 4 is Rinkeby chainId. This is a Rinkeby application.
      if (chainId !== 4) {
        throw new ChainIdError();
      }

      const contractInteractionDryRunErrorMessageMaker =
        await validateContractInteraction(
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
      setTriggerWaitForTransaction(true);
      setCancelMessage({
        messageType: MESSAGE.SUCCESS,
        title: "The voucher set was cancelled",
        text: "The vouchers have been cancelled, except the ones that were committed.",
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
              setTriggerWaitForTransaction={setTriggerWaitForTransaction}
            />
          ) : null}
          {imageView ? (
            <FullScreenImage
              src={getProp("image")}
              setImageView={setImageView}
            />
          ) : null}
          <div className="container erase">
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
            <div className="voucher-column-holder">
              <div className="voucher-column">
                <div className="content">
                  <div className="escrow-controls-holder">
                    {!voucherSetDetails &&
                    voucherStatus?.split(":")[0] !== ROLE.NON_BUYER_SELLER ? (
                      <div className="section escrow">
                        {escrowData ? (
                          <EscrowTable escrowData={escrowData} />
                        ) : null}
                      </div>
                    ) : null}

                    {distributionMessage ? (
                      <div className="deposits-warning-holder">
                        <div className="section depositsWarning flex center">
                          <IconWarning /> <span> {distributionMessage}</span>{" "}
                        </div>
                      </div>
                    ) : null}

                    {!voucherSetDetails && voucherControls?.controls ? (
                      <div className="section voucher-control">
                        {voucherControls.controls}
                      </div>
                    ) : null}
                  </div>

                  <div className="section info">
                    <div className="section description">
                      {
                        <ImageBlock
                          toggleImageView={setImageView}
                          voucherSetDetails={voucherSetDetails}
                          getProp={getProp}
                        />
                      }
                    </div>
                  </div>
                  {voucherSetDetails ? (
                    <div className="voucher-control-holder">
                      <div className="voucher-control-column">
                        <p className="deposit-label">Payment Price</p>
                        <p className="deposit-value">
                          {" "}
                          {`${voucherSetDetails?.price} ${
                            currencyResolver(
                              voucherSetDetails?.paymentType
                            )[0] === "BSN"
                              ? "BOSON"
                              : currencyResolver(
                                  voucherSetDetails?.paymentType
                                )[0]
                          }`}{" "}
                        </p>
                      </div>
                      <div className="voucher-control-column">
                        {voucherControls?.controls
                          ? voucherControls.controls
                          : null}
                      </div>
                    </div>
                  ) : null}

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
                </div>
              </div>
              <div className="voucher-column">
                <div className="content">
                  <div className="section title">
                    <h1>{getProp("title")}</h1>
                  </div>
                  <div className="section info additional-info">
                    <div className="section description">
                      {
                        <DescriptionBlock
                          toggleImageView={setImageView}
                          voucherSetDetails={voucherSetDetails}
                          getProp={getProp}
                        />
                      }
                    </div>
                    <div className="section category">
                      {getProp("category") ? (
                        <TableRow data={tableCategory} />
                      ) : null}
                      {getProp("condition") ? (
                        <TableRow data={tableCondition} />
                      ) : null}
                    </div>
                    <div className="section location">
                      {tableLocation ? (
                        <TableLocation
                          data={tableLocation}
                          hasBiggerTitle={false}
                        />
                      ) : null}
                    </div>
                    <div className="section date">
                      {tableDate.some((item) => item) ? (
                        <DateTable data={tableDate} />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {disablePage ? (
        <GenericMessage
          subprops={{ button: "HOME PAGE" }}
          messageType={MESSAGE.LOCKED}
          title="Invalid link"
          link={ROUTE.Home}
          Í
        />
      ) : null}

      {successMessage ? (
        <GenericMessage
          messageType={successMessageType}
          title={successMessage}
          // text={successMessageType}
          link={window.location}
          setMessageType={resetSuccessMessage}
        />
      ) : null}
    </>
  );
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

    const contractInteractionDryRunErrorMessageMaker =
      await validateContractInteraction(
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
          content: "You do not have enough BOSON to execute this transaction.",
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

    const contractInteractionDryRunErrorMessageMaker =
      await validateContractInteraction(
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
          content: "You do not have enough BOSON to execute this transaction.",
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

    const contractInteractionDryRunErrorMessageMaker =
      await validateContractInteraction(
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
          content: "You do not have enough BOSON to execute this transaction.",
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

    const contractInteractionDryRunErrorMessageMaker =
      await validateContractInteraction(
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
