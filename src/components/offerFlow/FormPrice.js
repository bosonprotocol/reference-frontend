import React, { useContext, useEffect } from 'react'

import { SellerContext, Seller } from "../../contexts/Seller"

import Currencies from "./Currencies"

import { NAME, CURRENCY } from "../../helpers/Dictionary"


function FormPrice() {
  const sellerContext = useContext(SellerContext)

  const price = sellerContext.state.offeringData[NAME.PRICE]
  const priceCurrency = sellerContext.state.offeringData[NAME.PRICE_C]
  const priceSuffix = sellerContext.state.offeringData[NAME.PRICE_SUFFIX]
  const seller = sellerContext.state.offeringData[NAME.SELLER_DEPOSIT]
  const sellerCurrency = sellerContext.state.offeringData[NAME.SELLER_DEPOSIT_C]
  const sellerSuffix = sellerContext.state.offeringData[NAME.SELLER_SUFFIX]

  const updateSuffix = (name, value) => {
    console.log(name, value)
    sellerContext.dispatch(Seller.updateOfferingData({
      [name]: value
    }))
  }

  // toggle 1 = remove placeholder; toggle 0 = add placeholder
  const focusHandler = (el, toggle) => {
    toggle ?
      el.parentElement.classList.add("focus") :
      el.parentElement.classList.remove("focus")
  }

  // on change of currency, or value - update placeholder
  useEffect(() => {
    if(priceCurrency !== undefined)
    updateSuffix(NAME.PRICE_SUFFIX, `${price === '' || price === undefined ? 0 : price} ${priceCurrency}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, priceCurrency])

  useEffect(() => {
    if(sellerCurrency !== undefined)
      updateSuffix(NAME.SELLER_SUFFIX, `${seller === '' || seller === undefined ? 0 : seller} ${sellerCurrency}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seller, sellerCurrency])

  const generalSettings = {
    step: 0.01,
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
              <div name={NAME.PRICE_SUFFIX} className="pseudo">{priceSuffix}</div>
              <input
              onFocus={(e) => focusHandler(e.target, 1)}
              onBlur={(e) => focusHandler(e.target, 0)}
              id="offer-price" type="number" name={NAME.PRICE} min="0.00"
              max={buyerSettings[priceCurrency] ? buyerSettings[priceCurrency].max : 0}
              step={generalSettings.step} />
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
              <div name={NAME.SELLER_SUFFIX} className="pseudo">{sellerSuffix}</div>
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
            <input id="offer-buyer-deposit" type="number" name={NAME.BUYER_DEPOSIT} min="0.00"
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
