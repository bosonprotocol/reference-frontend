import { ethers } from "ethers";
import { ModalResolver } from "../../contexts/Modal";
import { MODAL_TYPES } from "../../helpers/configs/Dictionary";
import { getPaymentsDetails } from "../../hooks/api";

export const getEscrowData = async (
    voucherDetails, 
    account, 
    modalContext,
    setDistributionMessage,
    currencies,
    getAccountStoredInLocalStorage
    ) => {
    const payments = await getPayments(  
        account, 
        modalContext, 
        getAccountStoredInLocalStorage, 
        voucherDetails);

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


async function getPayments(
    account, 
    modalContext, 
    getAccountStoredInLocalStorage, 
    voucherDetails
    ) {
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
      return getPaymentsDetails(voucherDetails.id, authData.authToken);
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