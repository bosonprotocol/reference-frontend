import React from 'react'

import "./ProductSingle.scss"

import { IconCalendar } from "../components/Icons"


const tableRow = (title, value) => {
  return <div className="row flex jc-sb ai-center">
    <p className="title">{title}</p>
    <p className="value">{value}</p>
  </div>
}

const priceTable = (objPrices) => {
  const {payment, buyerD, sellerD} = objPrices

  return <>
    <div className="row flex ai-center jc-sb">
      <div className="block flex">
        <div className="icon">
          <IconCalendar />
        </div>
        <div className="text">
          <p className="title">Payment Price</p>
          <p className="value">{payment} ETH</p>
        </div>
      </div>
      <div className="block flex">
        <div className="icon">
          <IconCalendar />
        </div>
        <div className="text">
          <p className="title">Buyer’s deposit</p>
          <p className="value">{buyerD} ETH</p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="block flex">
        <div className="icon">
          <IconCalendar />
        </div>
        <div className="text">
          <p className="title">Seller’s deposit</p>
          <p className="value">{sellerD} ETH</p>
        </div>
      </div>
    </div>
  </>
}

const dateTable = (objPrices) => {
  const {start, expiry} = objPrices

  return <>
    <div className="block flex">
      <div className="icon">
        <img src="" alt=""/>
      </div>
      <div className="text">
        <p className="title">Start Date</p>
        <p className="value">{start}</p>
      </div>
    </div>
    <div className="block flex">
      <div className="icon">
        <img src="" alt=""/>
      </div>
      <div className="text">
        <p className="title">Start Date</p>
        <p className="value">{expiry}</p>
      </div>
    </div>
  </>
}

function ProductSingle(props) {
  const {image, title, description} = props

  const tableContent = [
    ['Category', 'Clothing'],
    ['Remaining Quantity', 1],
  ]

  return (
    <section className="product-single">
      <div className="container">
        <div className="drag-controler"></div>
        <div className="thumbnail">
          <img src={image} alt={title} />
        </div>
        <div className="product-info">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="table location flex ai-center jc-sb">
          <p><img src="" alt=""/>Los Angeles</p>
          <div className="arrow expand"></div>
        </div>
        <div className="table product-info flex column">
          {tableContent.map(row => tableRow(row[0], row[1]))}
        </div>
        <div className="table price flex column">
          {priceTable({payment: 0.1, buyer: 0.02, seller: 0.01})}
        </div>
        <div className="table date flex jc-sb ai-center">
          {dateTable({start: '15/11/2020', expiry: '15/12/2020'})}
        </div>
      </div>
    </section>
  )
}

export default ProductSingle