import React, { useContext } from 'react'

import { TableRow, DateTable, PriceTable } from "../shared/TableContent"

import { SellerContext } from "../../contexts/Seller"

import { formatDate } from "../../helpers/Format"
import { ethers } from 'ethers'

function FormSummary() {
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
    image,
  } = sellerContext.state.offeringData
  const tableContent = [
    category && ['Category', category,],
    quantity && ['Remaining Quantity', quantity],
  ]

  const tablePrices = [
    (price && price_currency) ? 
      ['Payment Price', ethers.utils.formatEther(price), price_currency, 0] : false,
    false,
    (buyer_deposit && price_currency) ? 
      ['Buyer’s deposit', ethers.utils.formatEther(buyer_deposit), price_currency, 1]: false,
    (seller_deposit && seller_deposit) ? 
    ['Seller’s deposit', ethers.utils.formatEther(seller_deposit), seller_deposit_currency, 1] : false,
  ]

  const tableDate = [
    start_date && formatDate(start_date),
    end_date && formatDate(end_date)
  ]

  return (
    <div className="summary product-view">
      <h1>Offer voucher</h1>
      <div className="thumbnail flex center">
        <img className="mw100" src={image} alt={title} />
      </div>
      <div className="content">
        <div className="product-info">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {tableContent.some(item => item) ? <TableRow data={tableContent} /> : null}
        {tablePrices.some(item => item) ? <PriceTable data={tablePrices} /> : null}
        {tableDate.some(item => item) ? <DateTable data={tableDate} /> : null}
      </div>
    </div>
  )
}

export default FormSummary
