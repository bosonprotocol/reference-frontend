import React, { useContext, useEffect } from 'react'

import { SellerContext, Seller } from "../../contexts/Seller"

import Currencies from "./Currencies"

import { NAME } from "../../helpers/Dictionary"


function FormPrice() {
  const sellerContext = useContext(SellerContext)

  const price = sellerContext.state.offeringData[NAME.PRICE]
  const priceCurrency = sellerContext.state.offeringData[NAME.PRICE_C]
  const seller = sellerContext.state.offeringData[NAME.SELLER_DEPOSIT]
  const sellerCurrency = sellerContext.state.offeringData[NAME.PRICESELLER_DEPOSIT_C_C]
  
  const getCurrency = el => (
    sellerContext.state.offeringData
    [el.parentElement.parentElement
    .getElementsByTagName('select')[0].name]
  )

  const updateSuffix = (name, value) => {
    console.log(name, value)
    sellerContext.dispatch(Seller.updateOfferingData({
      [name]: value
    }))
  }

  const focusHandler = (el, toggle) => {
    toggle ?
      el.parentElement.classList.add("focus") :
      el.parentElement.classList.remove("focus")

    if(!toggle) {
      let propertyName = el.parentElement.querySelector('.pseudo').attributes["name"].value
      let valueToSet = el.value + ` ${getCurrency(el)}`

      // updateSuffix(propertyName, valueToSet)
    }
  }

  useEffect(() => {
    if(price && priceCurrency) updateSuffix(NAME.PRICE_SUFFIX, `${price} ${priceCurrency}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, priceCurrency])

  // useEffect(() => {
  //   updateSuffix(
  //     NAME.SELLER_SUFFIX,
  //     `${getContext(NAME.SELLER_DEPOSIT)} ${getContext(NAME.SELLER_DEPOSIT_C)}`
  //   )
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getContext(NAME.SELLER_DEPOSIT), getContext(NAME.SELLER_DEPOSIT_C)])

  const priceSettings = {
    max: 10000.00,
    step: 0.01,
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
              <div name={NAME.PRICE_SUFFIX} className="pseudo">{sellerContext.state.offeringData[NAME.PRICE_SUFFIX]}</div>
              <input
              onFocus={(e) => focusHandler(e.target, 1)}
              onBlur={(e) => focusHandler(e.target, 0)}
              id="offer-price" type="number" name={NAME.PRICE} min="0.00" max={priceSettings.max} step={priceSettings.step} />
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
              <div name={NAME.SELLER_SUFFIX} className="pseudo">{sellerContext.state.offeringData[NAME.SELLER_SUFFIX]}</div>
              <input
              onFocus={(e) => focusHandler(e.target, 1)}
              onBlur={(e) => focusHandler(e.target, 0)}
              id="offer-seller-deposit" type="number" name={NAME.SELLER_DEPOSIT} min="0.00" max={priceSettings.max} step={priceSettings.step}/>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-buyer-deposit">Buyer’s Deposit</label>
          <input id="offer-buyer-deposit" type="number" name={NAME.BUYER_DEPOSIT} min="0.00" max={priceSettings.max} step={priceSettings.step} />
        </div>
      </div>
    </div>
  )
}

export default FormPrice
