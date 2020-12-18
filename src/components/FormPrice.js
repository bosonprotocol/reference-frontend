import React from 'react'

import Currencies from "./Currencies"

import { NAME } from "../helpers/Dictionary"

function FormPrice() {
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
            <input id="offer-price" type="number" name={NAME.PRICE} min="0.00" max={priceSettings.max} step={priceSettings.step} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-seller-deposit">Seller’s Deposit</label>
          <div className="bind">
            <Currencies name={NAME.SELLER_DEPOSIT_C} />
            <input id="offer-seller-deposit" type="number" name={NAME.SELLER_DEPOSIT} min="0.00" max={priceSettings.max} step={priceSettings.step}/>
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
