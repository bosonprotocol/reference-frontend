import React, { useContext } from 'react'

import { TableRow, DateTable, PriceTable, TableLocation } from "./TableContent"

import { SellerContext } from "../contexts/Seller"

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
    seller_deposit_currency, 
    buyer_deposit,
  } = sellerContext.state.offeringData

  const tableContent = [
    category && ['Category', category,],
    quantity && ['Remaining Quantity', quantity],
  ]

  const tablePrices = [
    (price && price_currency) ? 
      ['Payment Price', price, price_currency, 0] : false,
    false,
    (buyer_deposit && price_currency) ? 
      ['Buyer’s deposit', buyer_deposit, price_currency, 1]: false,
    (seller_deposit && seller_deposit) ? 
    ['Seller’s deposit', seller_deposit, seller_deposit_currency, 1] : false,
  ]

  const tableDate = [
    start_date && start_date,
    end_date && end_date
  ]

  const tableLocation = 'Los Angeles'

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
        {tableLocation ? <TableLocation data={tableLocation} /> : null}
        {tableContent.some(item => item) ? <TableRow data={tableContent} /> : null}
        {tablePrices.some(item => item) ? <PriceTable data={tablePrices} /> : null}
        {tableDate.some(item => item) ? <DateTable data={tableDate} /> : null}
      </div>
    </div>
  )
}

export default FormSummary
