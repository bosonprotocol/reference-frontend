import React, { useContext } from 'react'

import { SellerContext } from "../../contexts/Seller"

import Currencies from "./Currencies"

import { NAME } from "../../helpers/Dictionary"


function FormPrice(props) {
  const sellerContext = useContext(SellerContext)

  const { priceSettings, sellerSettings, buyerSettings } = props

  const getData = name => sellerContext.state.offeringData[name]

  const price = getData(NAME.PRICE)
  const priceCurrency = getData(NAME.PRICE_C)
  const seller = getData(NAME.SELLER_DEPOSIT)
  const sellerCurrency = getData(NAME.SELLER_DEPOSIT_C)
  const buyer = getData(NAME.BUYER_DEPOSIT)

  const focusHandler = (el, toggle) => {
    // focus
    if(toggle) {
      el.parentElement.classList.add("focus")

      if(el.value !== getData(el.name)) el.value = getData(el.name)
    } 
    // blur
    else {
      el.parentElement.classList.remove("focus")

      if(el.parentElement.getAttribute("data-error")) {
        el.parentElement.removeAttribute("data-error")
      }
      // if(el.value > el.max) updateData(el.name, el.max, el)
    }
  }

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
            <div className="input relative">
              <div name={NAME.PRICE_SUFFIX} className="pseudo">{`${price} ${priceCurrency}`}</div>
              <input
              onFocus={(e) => focusHandler(e.target, 1)}
              onBlur={(e) => focusHandler(e.target, 0)}
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
            <div className="input relative">
              <div name={NAME.SELLER_SUFFIX} className="pseudo">{`${seller} ${sellerCurrency}`}</div>
              <input
              onFocus={(e) => focusHandler(e.target, 1)}
              onBlur={(e) => focusHandler(e.target, 0)}
              id="offer-seller-deposit" type="number" name={NAME.SELLER_DEPOSIT} />
              <div className="max">max {sellerSettings[sellerCurrency] ? sellerSettings[sellerCurrency].max : null} {sellerCurrency}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-buyer-deposit">Buyer’s Deposit</label>
          <div className="input relative">
            <div name={NAME.PRICE_SUFFIX} className="pseudo">{`${buyer} ${priceCurrency}`}</div>
            <input id="offer-buyer-deposit"
            onFocus={(e) => focusHandler(e.target, 1)}
            onBlur={(e) => focusHandler(e.target, 0)}
            type="number" name={NAME.BUYER_DEPOSIT} />
            <div className="max">max {buyerSettings[priceCurrency] ? buyerSettings[priceCurrency].max : null} {priceCurrency}</div> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormPrice
