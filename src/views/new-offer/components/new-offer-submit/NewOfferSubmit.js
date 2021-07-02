import React, { useContext, useState } from "react";
import {
  createVoucherSet,
  createEvent,
  getVoucherSetById,
} from "../../../../hooks/api";
import {
  useBosonRouterContract,
  useBosonTokenContract,
} from "../../../../hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";
import { getAccountStoredInLocalStorage } from "../../../../hooks/authenticate";
import GenericMessage from "../../../generic-message/GenericMessage";

import LoadingSpinner from "../../../../shared-components/loading-spinner/LoadingSpinner";

import { SellerContext } from "../../../../contexts/Seller";
import { GlobalContext, Action } from "../../../../contexts/Global";
import ContractInteractionButton from "../../../../shared-components/contract-interaction/contract-interaction-button/ContractInteractionButton";
import { useLocation } from "react-router-dom";
import { ModalContext, ModalResolver } from "../../../../contexts/Modal";
import {
  MODAL_TYPES,
  MESSAGE,
  ROUTE,
} from "../../../../helpers/configs/Dictionary";
import {
  SMART_CONTRACTS,
  SMART_CONTRACTS_EVENTS,
  PAYMENT_METHODS_LABELS,
  PAYMENT_METHODS,
} from "../../../../hooks/configs";
import { toFixed } from "../../../../utils/FormatUtils";
import { onAttemptToApprove } from "../../../../hooks/approveWithPermit";

import { isCorrelationIdAlreadySent } from "../../../../utils/DuplicateCorrelationIdGuard";
import { validateContractInteraction } from "../../../../helpers/validators/ContractInteractionValidator";
import "../../../../styles/PendingButton.scss";
import PendingButton from "../../../voucher-and-set-details/components/escrow-table/PendingButton";
import { prepareSingleVoucherSetData } from "../../../../helpers/parsers/VoucherAndSetParsers";
import PopupMessage from "./../../../../shared-components/popup-message/PopupMessage";

export default function NewOfferSubmit() {
  const [redirect, setRedirect] = useState(0);
  const [loading, setLoading] = useState(0);
  const [redirectLink, setRedirectLink] = useState(ROUTE.Home);

  const sellerContext = useContext(SellerContext);
  const modalContext = useContext(ModalContext);
  const location = useLocation();

  const [pending, setPending] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageType, setSuccessMessageType] = useState("");
  const [popupMessage, setPopupMessage] = useState();

  const globalContext = useContext(GlobalContext);

  const {
    start_date,
    end_date,
    price,
    seller_deposit,
    buyer_deposit,
    price_currency,
    deposits_currency,
    quantity,
    title,
    category,
    description,
    condition,
    selected_file, // switch with image to use blob
    address_line_one,
    address_line_two,
    city,
    country,
    postcode,
  } = sellerContext.state.offeringData;

  const { library, account, chainId } = useWeb3React();
  const bosonRouterContract = useBosonRouterContract();
  const bosonTokenContract = useBosonTokenContract();
  let formData = new FormData();

  async function onCreateVoucherSet() {
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

    setPopupMessage({
      text: "Please stay on this page to ensure your transaction processes successfully.",
      controls: (
        <div className="flex split buttons-pair">
          <div
            className="button primary"
            style={{ width: "100%" }}
            role="button"
            onClick={() => setPopupMessage(false)}
          >
            OK
          </div>
        </div>
      ),
    });

    let dataArr = [
      toFixed(new Date(start_date) / 1000, 0),
      toFixed(new Date(end_date) / 1000, 0),
      price.toString(),
      seller_deposit.toString(),
      buyer_deposit.toString(),
      parseInt(quantity),
    ];

    let correlationId;

    try {
      correlationId = (
        await bosonRouterContract.getCorrelationId(account)
      ).toString();

      const correlationIdRecentySent = isCorrelationIdAlreadySent(
        correlationId,
        account
      );

      if (correlationIdRecentySent) {
        setLoading(0);
        modalContext.dispatch(
          ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content:
              "Please wait for your recent transaction to be minted before sending another one.",
          })
        );
        return;
      }

      const created = await createNewVoucherSet(
        dataArr,
        bosonRouterContract,
        bosonTokenContract,
        account,
        chainId,
        library,
        price_currency,
        deposits_currency,
        modalContext,
        seller_deposit.add(buyer_deposit)
      );

      if (!created) {
        return;
      }

      const paymentType = paymentTypeResolver(
        price_currency,
        deposits_currency
      );

      prepareVoucherFormData(correlationId, dataArr, paymentType);

      const createdVoucherSet = await createVoucherSet(
        formData,
        authData.authToken
      );

      try {
        const eventData = {
          name: SMART_CONTRACTS_EVENTS.LOG_ORDER_CREATED,
          _correlationId: correlationId,
        };

        await createEvent(eventData, authData.authToken);
      } catch (e) {
        modalContext.dispatch(
          ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content:
              "Logging of the smart contract event failed. This does not affect creation of your voucher-set.",
          })
        );
      }

      setLoading(0);
      setPending(true);
      const backButton = document.getElementById("topOfferNavBackButton");
      if (backButton) {
        backButton.style.cssText += "pointer-events: none; opacity: 0.2";
      }
      await created.wait();

      globalContext.dispatch(
        Action.addVoucherSet(prepareSingleVoucherSetData(createdVoucherSet))
      );
      setSuccessMessage("Voucher set published");
      setSuccessMessageType(MESSAGE.NEW_VOUCHER_SET_SUCCESS);
      setRedirectLink(ROUTE.Activity);
      setRedirect(1);
      setPending(false);
    } catch (e) {
      setLoading(0);
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message,
        })
      );
      return;
    }
  }

  function prepareVoucherFormData(correlationId, dataArr, paymentType) {
    const startDate = new Date(dataArr[0] * 1000);
    const endDate = new Date(dataArr[1] * 1000);

    const location = JSON.stringify({
      country: country,
      city: city,
      addressLineOne: address_line_one,
      addressLineTwo: address_line_two,
      postcode: postcode,
    });

    appendFilesToFormData();

    formData.append("title", title);
    formData.append("qty", dataArr[5]);
    formData.append("category", category);
    formData.append("startDate", startDate.getTime());
    formData.append("expiryDate", endDate.getTime());
    formData.append("offeredDate", Date.now());
    formData.append("price", dataArr[2]);
    formData.append("buyerDeposit", dataArr[4]);
    formData.append("sellerDeposit", dataArr[3]);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("contact", "Contact");
    formData.append("conditions", condition);
    formData.append("voucherOwner", account);
    formData.append("_correlationId", correlationId);
    formData.append("_paymentType", paymentType);
  }

  function appendFilesToFormData() {
    formData.append("fileToUpload", selected_file, selected_file["name"]);
  }

  return (
    <>
      {loading ? <LoadingSpinner /> : null}
      {!redirect ? (
        pending ? (
          [<PendingButton />, <PopupMessage {...popupMessage} />]
        ) : (
          <ContractInteractionButton
            className="button offer primary"
            handleClick={onCreateVoucherSet}
            label="OFFER"
            sourcePath={location.pathname}
          />
        )
      ) : (
        <GenericMessage
          messageType={successMessageType}
          title={successMessage}
          link={redirectLink}
        />
      )}
    </>
  );
}

const createNewVoucherSet = async (
  dataArr,
  bosonRouterContract,
  tokenContract,
  account,
  chainId,
  library,
  priceCurrency,
  depositsCurrency,
  modalContext,
  depositsValue
) => {
  const currencyCombination = `${priceCurrency}${depositsCurrency}`;
  const txValue = ethers.BigNumber.from(dataArr[3]).mul(dataArr[5]);

  const tokensBalance = await tokenContract.balanceOf(account);
  const ethBalance = await tokenContract.provider.getBalance(account);

  if (currencyCombination === PAYMENT_METHODS_LABELS.ETHETH) {
    if (ethBalance.lt(depositsValue)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough ETH to create the voucher set.",
        })
      );
      return;
    }

    const contractInteractionDryRunErrorMessageMaker =
      await validateContractInteraction(
        bosonRouterContract,
        "requestCreateOrderETHETH",
        [dataArr, { value: txValue }]
      );

    if (
      contractInteractionDryRunErrorMessageMaker({
        action: "Create a new Voucher Set",
        account,
      })
    ) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: contractInteractionDryRunErrorMessageMaker({
            action: "Create a new Voucher Set",
            account,
          }),
        })
      );
      return;
    }

    return bosonRouterContract.requestCreateOrderETHETH(dataArr, {
      value: txValue,
    });
  } else if (currencyCombination === PAYMENT_METHODS_LABELS.BSNETH) {
    if (ethBalance.lt(depositsValue)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough ETH to create the voucher set.",
        })
      );
      return;
    }

    const contractInteractionDryRunErrorMessageMaker =
      await validateContractInteraction(
        bosonRouterContract,
        "requestCreateOrderTKNETH",
        [SMART_CONTRACTS.BosonTokenContractAddress, dataArr, { value: txValue }]
      );

    if (
      contractInteractionDryRunErrorMessageMaker({
        action: "Create a new Voucher Set",
        account,
      })
    ) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: contractInteractionDryRunErrorMessageMaker({
            action: "Create a new Voucher Set",
            account,
          }),
        })
      );
      return;
    }

    return bosonRouterContract.requestCreateOrderTKNETH(
      SMART_CONTRACTS.BosonTokenContractAddress,
      dataArr,
      { value: txValue }
    );
  } else if (currencyCombination === PAYMENT_METHODS_LABELS.BSNBSN) {
    //ToDo: Split functionality in two step, first sign, then send tx

    if (tokensBalance.lt(depositsValue)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough BSN to create the voucher set.",
        })
      );
      return;
    }

    const signature = await onAttemptToApprove(
      tokenContract,
      library,
      account,
      chainId,
      txValue
    );

    const contractInteractionDryRunErrorMessageMaker =
      await validateContractInteraction(
        bosonRouterContract,
        "requestCreateOrderTKNTKNWithPermit",
        [
          SMART_CONTRACTS.BosonTokenContractAddress,
          SMART_CONTRACTS.BosonTokenContractAddress,
          txValue.toString(),
          signature.deadline,
          signature.v,
          signature.r,
          signature.s,
          dataArr,
        ]
      );
    if (
      contractInteractionDryRunErrorMessageMaker({
        action: "Create a new Voucher Set",
        account,
      })
    ) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: contractInteractionDryRunErrorMessageMaker({
            action: "Create a new Voucher Set",
            account,
          }),
        })
      );
      return;
    }

    return bosonRouterContract.requestCreateOrderTKNTKNWithPermit(
      SMART_CONTRACTS.BosonTokenContractAddress,
      SMART_CONTRACTS.BosonTokenContractAddress,
      txValue.toString(),
      signature.deadline,
      signature.v,
      signature.r,
      signature.s,
      dataArr
    );
  } else if (currencyCombination === PAYMENT_METHODS_LABELS.ETHBSN) {
    //ToDo: Split functionality in two step, first sign, then send tx

    if (tokensBalance.lt(depositsValue)) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: "You do not have enough BSN to create the voucher set.",
        })
      );
      return;
    }

    const signature = await onAttemptToApprove(
      tokenContract,
      library,
      account,
      chainId,
      txValue
    );
    const contractInteractionDryRunErrorMessageMaker =
      await validateContractInteraction(
        bosonRouterContract,
        "requestCreateOrderETHTKNWithPermit",
        [
          SMART_CONTRACTS.BosonTokenContractAddress,
          txValue.toString(),
          signature.deadline,
          signature.v,
          signature.r,
          signature.s,
          dataArr,
        ]
      );
    if (
      contractInteractionDryRunErrorMessageMaker({
        action: "Create a new Voucher Set",
        account,
      })
    ) {
      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: contractInteractionDryRunErrorMessageMaker({
            action: "Create a new Voucher Set",
            account,
          }),
        })
      );
      return;
    }

    return bosonRouterContract.requestCreateOrderETHTKNWithPermit(
      SMART_CONTRACTS.BosonTokenContractAddress,
      txValue.toString(),
      signature.deadline,
      signature.v,
      signature.r,
      signature.s,
      dataArr
    );
  } else {
    console.error(`Currencies combination not found ${currencyCombination}`);
    throw new Error("Something went wrong");
  }
};

const paymentTypeResolver = (priceCurrency, depositsCurrency) => {
  switch (priceCurrency + depositsCurrency) {
    case PAYMENT_METHODS_LABELS.ETHETH: {
      return PAYMENT_METHODS.ETHETH;
    }
    case PAYMENT_METHODS_LABELS.ETHBSN: {
      return PAYMENT_METHODS.ETHBSN;
    }
    case PAYMENT_METHODS_LABELS.BSNETH: {
      return PAYMENT_METHODS.BSNETH;
    }
    case PAYMENT_METHODS_LABELS.BSNBSN: {
      return PAYMENT_METHODS.BSNBSN;
    }
    default: {
      throw new Error("Unknown currency combination");
    }
  }
};
