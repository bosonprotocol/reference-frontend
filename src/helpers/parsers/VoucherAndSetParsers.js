import {
  getAllVoucherSets,
  getVouchers,
  getAccountVoucherSets,
  getVouchersFromSupply,
} from "../../hooks/api";
import * as ethers from "ethers";
import { getAccountStoredInLocalStorage } from "../../hooks/authenticate";
import { MODAL_TYPES, STATUS } from "../configs/Dictionary";
import { ModalResolver } from "../../contexts/Modal";
import { PAYMENT_METHODS } from "../../hooks/configs";

export async function fetchVoucherSets() {
  const allVoucherSets = await getAllVoucherSets();
  const result = prepareVoucherSetData(allVoucherSets);

  return result;
}

export const prepareVoucherSetData = (rawVoucherSets) => {
  let parsedVoucherSets = [];

  if (!rawVoucherSets) return [];

  for (const voucherSet of rawVoucherSets.voucherSupplies) {
    let parsedVoucherSet = {
      id: voucherSet._id,
      title: voucherSet.title,
      image: voucherSet.imagefiles[0]?.url
        ? voucherSet.imagefiles[0].url
        : "images/temp/product-block-image-temp.png",
      price: ethers.utils.formatEther(voucherSet.price.$numberDecimal),
      deposit: ethers.utils.formatEther(voucherSet.buyerDeposit.$numberDecimal),
      qty: voucherSet.qty,
      category: voucherSet.category,
      condition: voucherSet.conditions,
      contact: voucherSet.contact,
      description: voucherSet.description,
      expiryDate: voucherSet.expiryDate,
      location: voucherSet.location,
      priceCurrency: voucherSet.priceCurrency,
      sellerDepositCurrency: voucherSet.sellerDepositCurrency,
      offeredDate: voucherSet.offeredDate,
      sellerDeposit: ethers.utils.formatEther(
        voucherSet.sellerDeposit.$numberDecimal
      ),
      startDate: voucherSet.startDate,
      txHash: voucherSet.txHash,
      visible: voucherSet.visible,
      currency: voucherSet.currency ? voucherSet._currency : "ETH",
      voucherOwner: voucherSet.voucherOwner,
      __v: voucherSet.__v,
      _id: voucherSet._id,
      _tokenIdSupply: voucherSet._tokenIdSupply,
      paymentType: voucherSet._paymentType
        ? voucherSet._paymentType
        : PAYMENT_METHODS.ETHETH,
    };

    parsedVoucherSets.push(parsedVoucherSet);
  }

  return parsedVoucherSets;
};

export const prepareAccountVoucherSetData = (rawVoucherSets) => {
  if (!rawVoucherSets) return;

  const parsedVoucherSets = rawVoucherSets.voucherSupplies.map(prepareSingleVoucherSetData);

  return parsedVoucherSets;
};
export const prepareSingleVoucherSetData = (voucherSet) => ({
  _id: voucherSet._id,
  title: voucherSet.title,
  image: voucherSet.imagefiles[0]?.url
    ? voucherSet.imagefiles[0].url
    : "images/temp/product-block-image-temp.png",
  price: ethers.utils.formatEther(voucherSet.price.$numberDecimal),
  qty: voucherSet.qty,
  startDate: voucherSet.startDate,
  category: voucherSet.category,
  description: voucherSet.description,
  expiryDate: voucherSet.expiryDate,
  visible: voucherSet.visible,
  currency: voucherSet.currency ? voucherSet._currency : "ETH",
  voucherOwner: voucherSet.voucherOwner,
  paymentType: voucherSet._paymentType ? voucherSet._paymentType : 1,
});

export const prepareVoucherData = (rawVouchers) => {
  if (!rawVouchers) return;

  const parsedVouchers = rawVouchers.map((voucher) => ({
    CANCELLED: voucher.CANCELLED,
    COMMITTED: voucher.COMMITTED,
    COMPLAINED: voucher.COMPLAINED,
    EXPIRED: voucher.EXPIRED,
    FINALIZED: voucher.FINALIZED,
    REDEEMED: voucher.REDEEMED,
    REFUNDED: voucher.REFUNDED,
    id: voucher._id,
    visible: voucher.visible,
    title: voucher.title,
    qty: voucher.qty,
    price: ethers.utils.formatEther(voucher.price.$numberDecimal),
    image: voucher.imagefiles[0]?.url
      ? voucher.imagefiles[0].url
      : "images/temp/product-block-image-temp.png",
    expiryDate: voucher.expiryDate,
    description: voucher.description,
    category: voucher.category,
    currency: voucher.currency ? voucher._currency : "ETH",
    paymentType: voucher.paymentType ? voucher.paymentType : 1,
  }));

  return parsedVouchers;
};

export async function getAccountVouchers(account, modalContext) {
  if (!account) {
    return;
  }

  const authData = getAccountStoredInLocalStorage(account);

  if (!authData.activeToken) {
    modalContext.dispatch(
      ModalResolver.showModal({
        show: true,
        type: MODAL_TYPES.GENERIC_ERROR,
        content:
          "Please check your wallet for Signature Request. Once authentication message is signed you can proceed ",
      })
    );
    return;
  }

  const allAccountVouchers = await getVouchers(authData.authToken);
  const vouchersParsed =
    allAccountVouchers.voucherData &&
    prepareVoucherData(allAccountVouchers.voucherData);

  return vouchersParsed ? vouchersParsed : [];
}

export async function getParsedAccountVoucherSets(account) {
  if (!account) {
    return;
  }

  const authData = getAccountStoredInLocalStorage(account);
  const accountVoucherSets = await getAccountVoucherSets(authData.address);

  const parsedData = prepareAccountVoucherSetData(accountVoucherSets);

  return parsedData ? parsedData : [];
}

export async function getParsedVouchersFromSupply(voucherSetId, account) {
  if (!account) {
    return;
  }

  const authData = getAccountStoredInLocalStorage(account);
  const voucherFromSupply = await getVouchersFromSupply(
    voucherSetId,
    authData.authToken
  );

  return voucherFromSupply ? voucherFromSupply : undefined;
}

export const prepareVoucherDetails = (rawVoucher) => {
  let parsedVoucher = {
    id: rawVoucher._id,
    title: rawVoucher.title,
    description: rawVoucher.description,
    //ToDo: Image should be get from voucher set
    // image: rawVoucher.imagefiles[0]?.url ? rawVoucher.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
    price: ethers.utils.formatEther(rawVoucher?.price.$numberDecimal),
    buyerDeposit: ethers.utils.formatEther(
      rawVoucher?.buyerDeposit.$numberDecimal
    ),
    sellerDeposit: ethers.utils.formatEther(
      rawVoucher?.sellerDeposit.$numberDecimal
    ),
    qty: rawVoucher.qty,
    startDate: rawVoucher.startDate,
    expiryDate: rawVoucher.expiryDate,
    category: rawVoucher.category,
    location: rawVoucher.location,
    voucherOwner: rawVoucher.voucherOwner,
    paymentType: rawVoucher?.paymentType ? rawVoucher?.paymentType : 1,
    holder: rawVoucher._holder,
    CANCELLED: rawVoucher.CANCELLED,
    COMMITTED: rawVoucher.COMMITTED,
    COMPLAINED: rawVoucher.COMPLAINED,
    FINALIZED: rawVoucher.FINALIZED,
    REDEEMED: rawVoucher.REDEEMED,
    REFUNDED: rawVoucher.REFUNDED,
    commitedDate: rawVoucher.COMMITTED,
    image: rawVoucher?.imagefiles[0]?.url,
    _tokenIdVoucher: rawVoucher._tokenIdVoucher,
    currency: rawVoucher.currency ? rawVoucher._currency : "ETH",
  };

  return parsedVoucher;
};

export async function initVoucherDetails(
  account,
  modalContext,
  getVoucherDetails,
  voucherId
) {
  if (!account) {
    return;
  }

  const authData = getAccountStoredInLocalStorage(account);

  if (!authData.activeToken) {
    modalContext.dispatch(
      ModalResolver.showModal({
        show: true,
        type: MODAL_TYPES.GENERIC_ERROR,
        content:
          "Please check your wallet for Signature Request. Once authentication message is signed you can proceed ",
      })
    );
    return;
  }

  const rawVoucherDetails = await getVoucherDetails(
    voucherId,
    authData.authToken
  );
  const parsedVoucher = await prepareVoucherDetails(rawVoucherDetails.voucher);

  if (parsedVoucher) return parsedVoucher;
}

export async function addNewVoucher(
  account,
  getVoucherDetails,
  voucherId,
  arrayOfAllVouchers
) {
  if (!account) {
    return;
  }

  const authData = getAccountStoredInLocalStorage(account);

  const rawVoucherDetails = await getVoucherDetails(
    voucherId,
    authData.authToken
  );
  const parsedVoucher = await prepareVoucherDetails(rawVoucherDetails.voucher);

  if (parsedVoucher) arrayOfAllVouchers.push(parsedVoucher);
}

export const determineCurrentStatusOfVoucher = (voucherDetails) => {
  const allStatuses = [];
  if (voucherDetails.COMMITTED)
    allStatuses.push({
      status: STATUS.COMMITED,
      date: voucherDetails.COMMITTED,
    });
  if (voucherDetails.REDEEMED)
    allStatuses.push({
      status: STATUS.REDEEMED,
      date: voucherDetails.REDEEMED,
    });
  if (voucherDetails.REFUNDED)
    allStatuses.push({
      status: STATUS.REFUNDED,
      date: voucherDetails.REFUNDED,
    });
  if (voucherDetails.COMPLAINED)
    allStatuses.push({
      status: STATUS.COMPLAINED,
      date: voucherDetails.COMPLAINED,
    });
  if (voucherDetails.CANCELLED)
    allStatuses.push({
      status: STATUS.CANCELLED,
      date: voucherDetails.CANCELLED,
    });
  return allStatuses.sort((a, b) => (a.date > b.date ? 1 : -1))[
    allStatuses.length - 1
  ];
};
