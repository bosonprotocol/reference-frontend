import React, { useContext } from 'react'

import { SellerContext, getData } from "../../contexts/Seller"

import Currencies from "./Currencies"

import { NAME } from "../../helpers/Dictionary"
import { ethers } from 'ethers'


function FormPrice({
  depositsPriceLimits, 
  priceValueReceiver,
  priceCurrencyReceiver,
  sellerDepositCurrencyValueReceiver,
  sellerDepositValueReceiver,
  buyerDepositValueReceiver,
  quantityValueReceiver,
  quantityErrorMessage,
  sellerDepositErrorMessage,
  priceErrorMessage,
  buyerDepositErrorMessage
}) {
  const sellerContext = useContext(SellerContext)

  const getOfferingData = getData(sellerContext.state.offeringData)

  const quantity = getOfferingData(NAME.QUANTITY);
  console.log(quantity)
  const priceCurrency = getOfferingData(NAME.PRICE_C) || 'ETH'
  const sellerCurrency = getOfferingData(NAME.SELLER_DEPOSIT_C) || 'ETH'
  const buyer = getOfferingData(NAME.BUYER_DEPOSIT) || 'ETH'

  return (
    <div className="price">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-quantity">Quantity</label>
          <div className="input focus" data-error={quantityErrorMessage}>
            <input id="offer-quantity" type="number"  onChange={(e) => quantityValueReceiver(e.target ? e.target.value : null)}/>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-price">Payment Price</label>
          <div className="bind">
            <Currencies inputValueHandler={priceCurrencyReceiver}/>
            <div className="input relative focus" data-error={priceErrorMessage}>
              <input
              id="offer-price" type="number" onChange={(e) => priceValueReceiver(e.target ? e.target.value : null)}/>
              {
                depositsPriceLimits[priceCurrency]?.max ?              
                <div className="max">max {depositsPriceLimits[priceCurrency] ? ethers.utils.formatEther(depositsPriceLimits[priceCurrency].max) : null} {priceCurrency}</div>
                : null
              }
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-buyer-deposit">Buyer’s Deposit</label>
          <div className="input relative focus" data-error={buyerDepositErrorMessage}>
            <div name={NAME.PRICE_SUFFIX} className="pseudo">{`${buyer} ${priceCurrency}`}</div>
            <input id="offer-buyer-deposit"
            type="number" name={NAME.BUYER_DEPOSIT} onChange={(e) => buyerDepositValueReceiver(e.target ? e.target.value : null)}/>
            {
              depositsPriceLimits[priceCurrency].max ?
              <div className="max">max {depositsPriceLimits[priceCurrency] ? ethers.utils.formatEther(depositsPriceLimits[priceCurrency].max) : null} {priceCurrency}</div> 
              : null
            }
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-seller-deposit">Seller’s Deposit</label>
          <div className="bind">
            <Currencies inputValueHandler={sellerDepositCurrencyValueReceiver} />
            <div className="input relative focus" data-error={sellerDepositErrorMessage}>
              <input
              id="offer-seller-deposit" type="number" onChange={(e) => sellerDepositValueReceiver(e.target ? e.target.value : null)} />
              {
                depositsPriceLimits[sellerCurrency]?.max? 
                <div className="max">max {depositsPriceLimits[sellerCurrency] ? ethers.utils.formatEther(depositsPriceLimits[sellerCurrency].max) : null} {sellerCurrency}</div>
                : null
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormPrice
