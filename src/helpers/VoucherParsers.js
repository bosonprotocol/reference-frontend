import { getAllVoucherSets, getVouchers } from "../hooks/api";
import * as ethers from "ethers";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { MODAL_TYPES } from "../helpers/Dictionary";
import { ModalResolver } from "../contexts/Modal";


export async function fetchVoucherSets() {
  const allVoucherSets = await getAllVoucherSets();
  const result = prepareVoucherSetData(allVoucherSets)

  return result
}

export const prepareVoucherSetData = (rawVoucherSets) => {
  let parsedVoucherSets = [];
  
  if(!rawVoucherSets) return

  for (const voucherSet of rawVoucherSets.voucherSupplies) {
      let parsedVoucherSet = {
          id: voucherSet._id,
          title: voucherSet.title,
          image: voucherSet.imagefiles[0]?.url ? voucherSet.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
          price: ethers.utils.formatEther(voucherSet.price.$numberDecimal),
          deposit: ethers.utils.formatEther(voucherSet.buyerDeposit.$numberDecimal),
          qty: voucherSet.qty,
          category: voucherSet.category,
          condition: voucherSet.conditions,
          contact: voucherSet.contact,
          description: voucherSet.description,
          expiryDate: voucherSet.expiryDate,
          location: voucherSet.location,
          offeredDate: voucherSet.offeredDate,
          sellerDeposit: ethers.utils.formatEther(voucherSet.sellerDeposit.$numberDecimal),
          startDate: voucherSet.startDate,
          txHash: voucherSet.txHash,
          visible: voucherSet.visible,
          currency: voucherSet.currency ? voucherSet._currency : 'ETH',
          voucherOwner: voucherSet.voucherOwner,
          __v: voucherSet.__v,
          _id: voucherSet._id,
          _tokenIdSupply: voucherSet._tokenIdSupply,
      };

      parsedVoucherSets.push(parsedVoucherSet)
  }

  return parsedVoucherSets
}

export const prepareVoucherData = (rawVouchers) => {
  let parsedVouchers = [];
  
  if(!rawVouchers) return

  for (const voucher of rawVouchers) {
      let parsedVoucher = {
          id: voucher._id,
          visible: voucher.visible,
          title: voucher.title,
          qty: voucher.qty,
          price: ethers.utils.formatEther(voucher.price.$numberDecimal),
          image: voucher.imagefiles[0]?.url ? voucher.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
          expiryDate: voucher.expiryDate,
          description: voucher.description,
          category: voucher.category,
          currency: voucher.currency ? voucher._currency : 'ETH',
      };

      parsedVouchers.push(parsedVoucher)
  }

  return parsedVouchers
}

export async function getAccountVouchers(account, modalContext) {
  if (!account) {
      return;
  }

  const authData = getAccountStoredInLocalStorage(account);

  if (!authData.activeToken) {
      modalContext.dispatch(ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: 'Please check your wallet for Signature Request. Once authentication message is signed you can proceed '
      }));
      return;
  }


  const allAccountVouchers = await getVouchers(authData.authToken);
  const vouchersParsed = allAccountVouchers.voucherData && prepareVoucherData(allAccountVouchers.voucherData)

  return vouchersParsed ? vouchersParsed : undefined
}

export const prepareVoucherDetails = (rawVoucher) => {
  let parsedVoucher = {
      id: rawVoucher._id,
      title: rawVoucher.title,
      description: rawVoucher.description,
      //ToDo: Image should be get from voucher set
      // image: rawVoucher.imagefiles[0]?.url ? rawVoucher.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
      price: ethers.utils.formatEther(rawVoucher?.price.$numberDecimal),
      buyerDeposit: ethers.utils.formatEther(rawVoucher?.buyerDeposit.$numberDecimal),
      sellerDeposit: ethers.utils.formatEther(rawVoucher?.sellerDeposit.$numberDecimal),
      qty: rawVoucher.qty,
      startDate: rawVoucher.startDate,
      expiryDate: rawVoucher.expiryDate,
      category: rawVoucher.category,
      voucherOwner: rawVoucher.voucherOwner,
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
      currency: rawVoucher.currency ? rawVoucher._currency : 'ETH',
  };

  return parsedVoucher
};

export async function initVoucherDetails(account, modalContext, getVoucherDetails, voucherId) {
  
  if (!account) {
    return;
  }
  
  const authData = getAccountStoredInLocalStorage(account);

  if (!authData.activeToken) {
      modalContext.dispatch(ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: 'Please check your wallet for Signature Request. Once authentication message is signed you can proceed '
      }));
      return;
  }

  const rawVoucherDetails = await getVoucherDetails(voucherId, authData.authToken);
  const parsedVoucher = await prepareVoucherDetails(rawVoucherDetails.voucher);  
  if(parsedVoucher) return parsedVoucher
}

export async function addNewVoucher(account, getVoucherDetails, voucherId, arrayOfAllVouchers) {
  
  if (!account) {
    return;
  }
  
  const authData = getAccountStoredInLocalStorage(account);

  const rawVoucherDetails = await getVoucherDetails(voucherId, authData.authToken);
  const parsedVoucher = await prepareVoucherDetails(rawVoucherDetails.voucher);
  
  if(parsedVoucher) arrayOfAllVouchers.push(parsedVoucher) 
}