import React, { useRef, useEffect, useState } from 'react'

import "./ProductView.scss"

import { IconCalendar, IconLocation, IconDeposit, IconEth } from "./Icons"


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
  const [deltaOffset, setDeltaOffset] = useState()
  const [deltaState, setDeltaState] = useState()
  const [deltaEnd, setDeltaEnd] = useState()
  let {image, title, description, productViewToggle, setProductViewToggle} = props

  image = 'images/temp/product-single-thumbnail.png'
  title = 'Nike Adapt Self-Lacing Smart Sneaker'
  description = 'A breakthrough lacing system that electronically adjusts to the shape of your foot. Get the right fit, every game, every step.'

  const tableContent = [
    ['Category', 'Clothing'],
    ['Remaining Quantity', 1],
  ]

  const dragControlerEnable = (e) => {
    productWindow.current.style.transition = 'none'
    console.log(e.clientY)
    setDeltaOffset(e.clientY)
    setDeltaState(1)
    console.log('state in open', deltaState)
  }

  const dragControlerDisable = () => {
    productWindow.current.style.transition = '0.4s ease-in-out'
    setDeltaState(0)
    console.log('close')

    productWindow.current.style.transform = deltaEnd > closePoint ?
    `translateY(100vh)` :
    `translateY(0px)`

    if(deltaEnd > closePoint) {
      setProductViewToggle(false)
    }
  }

  const dragControler = (e) => {
    setDeltaEnd(e.clientY - deltaOffset)
    console.log('state', deltaState)
    
    if(deltaState)
      console.log(deltaOffset)
      // productWindow.current.style.transform = `translateY(${delta.end}px)`
  }

  useEffect(() => {
    windowContainer.current.addEventListener('mousemove', dragControler)
    return windowContainer.current.removeEventListener('mousemove', dragControlerEnable)
  }, [])

  return (
    <section ref={windowContainer} className={`product-view no-bg ${productViewToggle && 'open'}`}
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