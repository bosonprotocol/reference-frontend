import React, { useContext } from 'react'

import { TableRow, DateTable, PriceTable } from "./TableContent"

import { SellerContext } from "../contexts/Seller"

import { IconLocation } from "./Icons"

function FormSummary(props) {
  const { imageUploaded } = props

  const sellerContext = useContext(SellerContext)
  const { 
    category, 
    title, 
    description, 
    quantity, 
    start_date, 
    end_date, 
    price,
    price_currency,
    seller_deposit, 
    buyer_deposit 
  } = sellerContext.state.offeringData

  const tableContent = [
    ['Category', category,],
    ['Remaining Quantity', quantity],
  ]

  const tablePrices = [
    ['Payment Price', price, price_currency, 0],
    false,
    ['Buyer’s deposit', buyer_deposit, price_currency, 1],
    ['Seller’s deposit', seller_deposit, price_currency, 1]
  ]

  const tableDate = {
    start: start_date,
    expiry: end_date
  }

  return (
    <div className="summary product-view">
      <h1>Offer voucher</h1>
      <div className="thumbnail flex center">
        <img className="mw100" src={imageUploaded} alt={title} />
      </div>
      <div className="content">
        <div className="product-info">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="table location flex ai-center jc-sb">
          <p className="flex center"><IconLocation />Los Angeles</p>
          <div className="arrow expand"></div>
        </div>
        <div className="table product-info flex column">
          {tableContent.map((row, id) => <TableRow key={id} title={row[0]} value={row[1]} />)}
        </div>
        <div className="table price flex column">
          {PriceTable(tablePrices)}
        </div>
        <div className="table date flex jc-sb ai-center">
          {DateTable(tableDate)}
        </div>
        <div className="button primary" role="button">OFFER</div>
      </div>
    </div>
  )
}

export default FormSummary
