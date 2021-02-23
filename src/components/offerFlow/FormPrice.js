import React, { useContext } from 'react'

import { SellerContext, getData } from "../../contexts/Seller"

import Currencies from "./Currencies"

import { NAME } from "../../helpers/Dictionary"
import { ethers } from 'ethers'
import { toFixed } from '../../utils/format-utils'


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
  
  const priceCurrency = getOfferingData(NAME.PRICE_C) || 'ETH'
  const sellerCurrency = getOfferingData(NAME.SELLER_DEPOSIT_C) || 'ETH'
  const buyer = getOfferingData(NAME.BUYER_DEPOSIT) || 'ETH'
  const price = getOfferingData(NAME.PRICE);
  const sellerDeposit = getOfferingData(NAME.SELLER_DEPOSIT);
  const buyerDeposit = getOfferingData(NAME.BUYER_DEPOSIT);

  const calculateMaxForCurrency = (currency) => {
    if(currency) {
      const maxFromContract = depositsPriceLimits[currency].max;
      if(quantity) {
        const maxWithQuantityTakenIntoAccount = maxFromContract.div(quantity);
        return toFixed(+ethers.utils.formatEther(maxWithQuantityTakenIntoAccount), 2)
      }
      return ethers.utils.formatEther(maxFromContract)
    }


  }
  const isValid = (value) => {
    try {
      ethers.utils.parseEther(value);
      return true
    }catch(e) {
      return false;
    }
  }

  const updateValueIfValid = (event, valueReceiver) => {
    if(!event || isNaN(parseInt(event.target.value)) || !isValid(event.target.value)) {
      valueReceiver(null)
      return;
    }
    valueReceiver(ethers.utils.parseEther(event.target.value))
  }
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
          <label htmlFor="offer-price">Payment Price Per Voucher</label>
          <div className="bind">
            <Currencies inputValueHandler={priceCurrencyReceiver}/>
            <div className="input relative focus" data-error={priceErrorMessage ? "" : null}>
              <input style={priceErrorMessage ? { color: '#FA5B66'} : {}}
              id="offer-price" type="number" onChange={(e) => updateValueIfValid(e,priceValueReceiver)}/>
              {
                depositsPriceLimits[priceCurrency]?.max ?              
                <div className="max">max {depositsPriceLimits[priceCurrency] ? calculateMaxForCurrency(priceCurrency) : null} {priceCurrency}</div>
                : null
              }
            </div>
           
            
          </div>
        </div>
      </div>
      {
              quantity > 1 && price ? 
              getLimitCalculationsBar(price, quantity, priceCurrency, priceErrorMessage)
              : null
      }
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-seller-deposit">Seller’s Deposit Per Voucher</label>
          <div className="bind">
            <Currencies inputValueHandler={sellerDepositCurrencyValueReceiver} />
            <div className="input relative focus" data-error={sellerDepositErrorMessage ? '' : null}>
              <input style={sellerDepositErrorMessage ? { color: '#FA5B66'} : {}}
              id="offer-seller-deposit" type="number" onChange={(e) => updateValueIfValid(e, sellerDepositValueReceiver)} />
              {
                depositsPriceLimits[sellerCurrency]?.max? 
                <div className="max">max {depositsPriceLimits[sellerCurrency] ?  calculateMaxForCurrency(sellerCurrency) : null} {sellerCurrency}</div>
                : null
              }
            </div>
          </div>
        </div>
      </div>
      {
              quantity > 1 && sellerDeposit ? 
              getLimitCalculationsBar(sellerDeposit, quantity, sellerCurrency, sellerDepositErrorMessage)
              : null
      }
      <div className="row">
        <div className="field">
          <label htmlFor="offer-buyer-deposit">Buyer’s Deposit Per Voucher</label>
          <div className="input relative focus" data-error={buyerDepositErrorMessage ? "" : null}>
            <div name={NAME.PRICE_SUFFIX} className="pseudo">{`${buyer} ${priceCurrency}`}</div>
            <input id="offer-buyer-deposit" style={buyerDepositErrorMessage ? { color: '#FA5B66'} : {}}
            type="number" name={NAME.BUYER_DEPOSIT} onChange={(e) => updateValueIfValid(e,buyerDepositValueReceiver)}/>
            {
              depositsPriceLimits[priceCurrency].max ?
              <div className="max">max {depositsPriceLimits[priceCurrency] ? calculateMaxForCurrency(priceCurrency) : null} {priceCurrency}</div> 
              : null
            }
          </div>
        </div>
      </div>
      {
              quantity > 1 && buyerDeposit ? 
              getLimitCalculationsBar(buyerDeposit, quantity, sellerCurrency, buyerDepositErrorMessage)
              : null
      }
    </div>
  )
}

export default FormPrice

const getLimitCalculationsBar = (amount, quantity, currency, errorMessage) => (

  <div className="row flex split" style={ {background: '#151A1F', height: '50px', marginTop: '20px'}}>
    <p className="flex" style={ {padding: '15px 13px'}}>
      <span className="field dual" style={errorMessage ? { color: '#FA5B66'} : {}} >
        {`${ethers.utils.formatEther(amount)} ${currency} `}
      </span>  
      <span className="field dual">
      &nbsp; {` x ${quantity} voucher${quantity > 1 ? 's' : ''}`}
      </span>
    </p>
    <p className="field dual" style={ {padding: '15px 13px'}}>
      {`=    ${ethers.utils.formatEther(amount.mul(quantity))} ${currency}`}
    </p>
  </div>

)