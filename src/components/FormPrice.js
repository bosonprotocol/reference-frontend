import React from 'react'

import Currencies from "./Currencies"

function FormPrice(props) {
  const { updateData } = props

  const priceSettings = {
    max: 10000.00,
    step: 0.01,
  }
  return (
    <div className="price">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-price">
            <h1>Payment Price</h1>
          </label>
          <div className="flex">
            <Currencies updateData={updateData} name="price_currency" />
            <input id="offer-price" type="number" min="0.00" max={priceSettings.max} step={priceSettings.step}
            onChange={(e) => updateData('price', e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-seller-deposit">Seller’s Deposit</label>
          <div className="flex">
            <Currencies updateData={updateData} name="seller_deposit_currency" />
            <input id="offer-seller-deposit" type="number" min="0.00" max={priceSettings.max} step={priceSettings.step}
            onChange={(e) => updateData('seller_deposit', e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-buyer-deposit">Buyer’s Deposit</label>
          <input id="offer-buyer-deposit" type="number" min="0.00" max={priceSettings.max} step={priceSettings.step}
          onChange={(e) => updateData('buyer_deposit', e.target.value)}/>
        </div>
      </div>
    </div>
  )
}

export default FormPrice
