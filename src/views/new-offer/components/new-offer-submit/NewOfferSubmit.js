import React, { useContext, useState } from "react";
import { createVoucherSet } from "../../../../hooks/api";
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
  PAYMENT_METHODS_LABELS,
  PAYMENT_METHODS,
} from "../../../../hooks/configs";
import { toFixed } from "../../../../utils/FormatUtils";
import { onAttemptToApprove } from "../../../../hooks/approveWithPermit";

import {
  isCorrelationIdAlreadySent,
  setRecentlyUsedCorrelationId,
} from "../../../../utils/DuplicateCorrelationIdGuard";
import { validateContractInteraction } from "../../../../helpers/validators/ContractInteractionValidator";

export default function NewOfferSubmit() {
  const [redirect, setRedirect] = useState(0);
  const [loading, setLoading] = useState(0);
  const [redirectLink, setRedirectLink] = useState(ROUTE.Home);

  const sellerContext = useContext(SellerContext);
  const modalContext = useContext(ModalContext);
  const location = useLocation();

  const globalContext = useContext(GlobalContext);

  const messageTitle = "Voucher set published";

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
        await bosonRouterContract.correlationIds(account)
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
        setLoading(0);
        return;
      }

      setRecentlyUsedCorrelationId(correlationId, account);

      const paymentType = paymentTypeResolver(
        price_currency,
        deposits_currency
      );

      prepareVoucherFormData(correlationId, dataArr, paymentType);

      await createVoucherSet(formData, authData.authToken);

      globalContext.dispatch(Action.fetchVoucherSets());

      setLoading(0);
      setRedirectLink(ROUTE.Activity);
      setRedirect(1);
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
    formData.append("location", "Location");
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
        <ContractInteractionButton
          className="button offer primary"
          handleClick={onCreateVoucherSet}
          label="OFFER"
          sourcePath={location.pathname}
        />
      ) : (
        <GenericMessage
          messageType={MESSAGE.SUCCESS}
          title={messageTitle}
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

    const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
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

    const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
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

    const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
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
    const contractInteractionDryRunErrorMessageMaker = await validateContractInteraction(
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
