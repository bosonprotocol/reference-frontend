import React, { useContext, useState } from 'react'

import { SellerContext, getData } from "../../contexts/Seller"

import Currencies from "./Currencies"

import { NAME } from "../../helpers/Dictionary"


function FormPrice({
  priceSettings, 
  sellerSettings, 
  buyerSettings,
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
  
  const [quantityHasBeenBlurred, setQuantityHasBeenBlurred] = useState(false);
  const [priceHasBeenBlurred, setPriceHasBeenBlurred] = useState(false);
  const [sellerDepositHasBeenBlurred, setSellerDepositHasBeenBlurred] = useState(false);
  const [buyerDepositHasBeenBlurred, setBuyerDepositHasBeenBlurred] = useState(false);

  const getOfferingData = getData(sellerContext.state.offeringData)

  const priceCurrency = getOfferingData(NAME.PRICE_C)
  const sellerCurrency = getOfferingData(NAME.SELLER_DEPOSIT_C)
  const buyer = getOfferingData(NAME.BUYER_DEPOSIT)

  return (
    <div className="price">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-quantity">Quantity</label>
          <div className="input focus" data-error={quantityHasBeenBlurred ? quantityErrorMessage : null}>
            <input id="offer-quantity" type="number" onBlur={()=> setQuantityHasBeenBlurred(true)}  onChange={(e) => quantityValueReceiver(e.target ? e.target.value : null)}/>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-price">Payment Price</label>
          <div className="bind">
            <Currencies inputValueHandler={priceCurrencyReceiver}/>
            <div className="input relative focus" data-error={priceHasBeenBlurred ? priceErrorMessage : null}>
              <input
              id="offer-price" type="number" onBlur={()=> setPriceHasBeenBlurred(true)} onChange={(e) => priceValueReceiver(e.target ? e.target.value : null)}/>
              <div className="max">max {priceSettings[priceCurrency] ? priceSettings[priceCurrency].max : null} {priceCurrency}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-buyer-deposit">Buyer’s Deposit</label>
          <div className="input relative focus" data-error={buyerDepositHasBeenBlurred ? buyerDepositErrorMessage : null}>
            <div name={NAME.PRICE_SUFFIX} className="pseudo">{`${buyer} ${priceCurrency}`}</div>
            <input id="offer-buyer-deposit"
            type="number" name={NAME.BUYER_DEPOSIT} onBlur={()=> setBuyerDepositHasBeenBlurred(true)} onChange={(e) => buyerDepositValueReceiver(e.target ? e.target.value : null)}/>
            <div className="max">max {buyerSettings[priceCurrency] ? buyerSettings[priceCurrency].max : null} {priceCurrency}</div> 
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-seller-deposit">Seller’s Deposit</label>
          <div className="bind">
            <Currencies inputValueHandler={sellerDepositCurrencyValueReceiver} />
            <div className="input relative focus" data-error={sellerDepositHasBeenBlurred ? sellerDepositErrorMessage: null}>
              <input
              id="offer-seller-deposit" type="number" onBlur={()=> setSellerDepositHasBeenBlurred(true)} onChange={(e) => sellerDepositValueReceiver(e.target ? e.target.value : null)} />
              <div className="max">max {sellerSettings[sellerCurrency] ? sellerSettings[sellerCurrency].max : null} {sellerCurrency}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormPrice
