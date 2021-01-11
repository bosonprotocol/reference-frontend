import React, { useContext, useEffect } from 'react'

import { SellerContext, Seller } from "../../contexts/Seller"

import Currencies from "./Currencies"

import { NAME, CURRENCY } from "../../helpers/Dictionary"


function FormPrice() {
  const sellerContext = useContext(SellerContext)

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

      if(el.value > el.max) el.value = el.max
    } 
    // blur
    else {
      el.parentElement.classList.remove("focus")
      // if(el.value > el.max) updateData(el.name, el.max, el)
    }
  }

  const generalSettings = {
    step: 0.01,
  }

  const priceSettings = {
    [CURRENCY.ETH]: {
      max: 2
    },
    [CURRENCY.BSN]: {
      max: 1.8
    }
  }

  const sellerSettings = { 
    [CURRENCY.ETH]: {
      max: 0.1
    },
    [CURRENCY.BSN]: {
      max: 0.2
    }
  }

  const buyerSettings = {
    [CURRENCY.ETH]: {
      max: 0.3
    },
    [CURRENCY.BSN]: {
      max: 0.4
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
              id="offer-price" type="number" name={NAME.PRICE} min="0.00"
              max={priceSettings[priceCurrency] ? priceSettings[priceCurrency].max : 0}
              step={generalSettings.step} />
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
              id="offer-seller-deposit" type="number" name={NAME.SELLER_DEPOSIT} min="0.00"
              max={sellerSettings[sellerCurrency] ? sellerSettings[sellerCurrency].max : 0}
              step={generalSettings.step}/>
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
            type="number" name={NAME.BUYER_DEPOSIT} min="0.00"
            max={buyerSettings[priceCurrency] ? buyerSettings[priceCurrency].max : 0} 
            step={generalSettings.step} />
            <div className="max">max {buyerSettings[priceCurrency] ? buyerSettings[priceCurrency].max : null} {priceCurrency}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormPrice
