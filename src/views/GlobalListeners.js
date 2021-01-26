import React, { useEffect, useState, useContext, useRef } from 'react';

import * as ethers from "ethers";

import { ModalContext, ModalResolver } from "../contexts/Modal";
import { GlobalContext, Action } from "../contexts/Global";
import { getVoucherDetails, updateVoucher, getAllVoucherSets } from "../hooks/api";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { useWeb3React } from "@web3-react/core";

import { MODAL_TYPES, ROUTE, STATUS } from "../helpers/Dictionary";

function PopulateVouchers() {
  const globalContext = useContext(GlobalContext);
  const { account } = useWeb3React();

  useEffect(() => {
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    fetchVoucherSets().then(result => 
      globalContext.dispatch(Action.allVoucherSets(result))
    )
    
  }, [])

  return null
}

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
          voucherOwner: voucherSet.voucherOwner,
          __v: voucherSet.__v,
          _id: voucherSet._id,
          _tokenIdSupply: voucherSet._tokenIdSupply,
      };

      parsedVoucherSets.push(parsedVoucherSet)
  }

  return parsedVoucherSets
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
      category: [['Category', rawVoucher.category]],
      voucherOwner: rawVoucher.voucherOwner,
      holder: rawVoucher._holder,
      CANCELLED: rawVoucher.CANCELLED,
      COMMITTED: rawVoucher.COMMITTED,
      COMPLAINED: rawVoucher.COMPLAINED,
      FINALIZED: rawVoucher.FINALIZED,
      REDEEMED: rawVoucher.REDEEMED,
      REFUNDED: rawVoucher.REFUNDED,
      commitedDate: rawVoucher.COMMITTED,
      _tokenIdVoucher: rawVoucher._tokenIdVoucher,
  };

  return parsedVoucher
};

export default PopulateVouchers
