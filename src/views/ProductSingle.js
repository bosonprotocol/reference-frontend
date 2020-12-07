import React, { useRef, useEffect } from 'react'

import "./ProductSingle.scss"

import { IconCalendar, IconLocation, IconDeposit, IconEth } from "../components/Icons"


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
          <IconEth color="#5D6F84" />
        </div>
        <div className="text">
          <p className="title">Payment Price</p>
          <p className="value">{payment} ETH</p>
        </div>
      </div>
      <div className="block flex">
        <div className="icon">
          <IconDeposit color="#5D6F84" />
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
          <IconDeposit color="#5D6F84" />
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
        <IconCalendar />
      </div>
      <div className="text">
        <p className="title">Start Date</p>
        <p className="value">{start}</p>
      </div>
    </div>
    <div className="block flex">
      <div className="icon">
        <IconCalendar />
      </div>
      <div className="text">
        <p className="title">Start Date</p>
        <p className="value">{expiry}</p>
      </div>
    </div>
  </>
}

const closePoint = window.innerHeight / 2

function ProductSingle(props) {
  const productWindow = useRef()
  const windowContainer = useRef()
  let {image, title, description} = props

  image = 'images/temp/product-single-thumbnail.png'
  title = 'Nike Adapt Self-Lacing Smart Sneaker'
  description = 'A breakthrough lacing system that electronically adjusts to the shape of your foot. Get the right fit, every game, every step.'

  const tableContent = [
    ['Category', 'Clothing'],
    ['Remaining Quantity', 1],
  ]

  const delta = {
    offset: 0,
    state: 0,
    end: 0
  }

  const dragControlerEnable = (e) => {
    productWindow.current.style.transition = 'none'
    delta.offset = e.clientY
    delta.state = 1
  }

  const dragControlerDisable = () => {
    productWindow.current.style.transition = '0.4s ease-in-out'
    delta.state = 0

    productWindow.current.style.transform = delta.end > closePoint ?
    `translateY(100vh)` :
    `translateY(0px)`

    if(delta.end > closePoint) {
      //close modal
    }
  }

  const dragControler = (e) => {
    delta.end = e.clientY - delta.offset

    if(delta.state)
      productWindow.current.style.transform = `translateY(${delta.end}px)`
  }

  useEffect(() => {
    windowContainer.current.addEventListener('mousemove', dragControler)
    return windowContainer.current.removeEventListener('mousemove', dragControlerEnable)
  }, [])

  return (
    <section ref={windowContainer} className="product-single"
      onMouseLeave={dragControlerDisable}
      onMouseUp={dragControlerDisable}
    >
      <div className="container erase">
        <div className="window" ref={productWindow}>
          <div className="drag-controler" onMouseDown={(e) => dragControlerEnable(e)}></div>
          <div className="thumbnail flex center">
            <img className="mw100" src={image} alt={title} />
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
              {tableContent.map(row => tableRow(row[0], row[1]))}
            </div>
            <div className="table price flex column">
              {priceTable({payment: 0.1, buyerD: 0.02, sellerD: 0.01})}
            </div>
            <div className="table date flex jc-sb ai-center">
              {dateTable({start: '15/11/2020', expiry: '15/12/2020'})}
            </div>
          </div>
        </div>
      </div>
      <div className="overlay"></div>
    </section>
  )
}

export default ProductSingle