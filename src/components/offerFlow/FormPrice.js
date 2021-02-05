import React, { useContext } from 'react'

import { SellerContext, getData } from "../../contexts/Seller"

import Currencies from "./Currencies"

import { NAME } from "../../helpers/Dictionary"


function FormPrice(props) {
  const sellerContext = useContext(SellerContext)

  const { priceSettings, sellerSettings, buyerSettings } = props

  const getOfferingData = getData(sellerContext.state.offeringData)

  const priceCurrency = getOfferingData(NAME.PRICE_C)
  const sellerCurrency = getOfferingData(NAME.SELLER_DEPOSIT_C)
  const buyer = getOfferingData(NAME.BUYER_DEPOSIT)

  return (
    <div className="price">
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-price">
            <div className="step-title">
              <h1>Payment Price</h1>
            </div>
          </label>
          <div className="bind">
            <Currencies name={NAME.PRICE_C} />
            <div className="input relative focus">
              <input
              id="offer-price" type="number" name={NAME.PRICE} />
              <div className="max">max {priceSettings[priceCurrency] ? priceSettings[priceCurrency].max : null} {priceCurrency}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-seller-deposit">Seller’s Deposit</label>
          <div className="bind">
            <Currencies name={NAME.SELLER_DEPOSIT_C} />
            <div className="input relative focus">
              <input
              id="offer-seller-deposit" type="number" name={NAME.SELLER_DEPOSIT} />
              <div className="max">max {sellerSettings[sellerCurrency] ? sellerSettings[sellerCurrency].max : null} {sellerCurrency}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-buyer-deposit">Buyer’s Deposit</label>
          <div className="input relative focus">
            <div name={NAME.PRICE_SUFFIX} className="pseudo">{`${buyer} ${priceCurrency}`}</div>
            <input id="offer-buyer-deposit"
            type="number" name={NAME.BUYER_DEPOSIT} />
            <div className="max">max {buyerSettings[priceCurrency] ? buyerSettings[priceCurrency].max : null} {priceCurrency}</div> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormPrice
