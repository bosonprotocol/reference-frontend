import React, { useRef, useEffect } from 'react'

import "./ProductView.scss"

import { IconLocation } from "./Icons"

import { TableRow, DateTable, PriceTable } from "./TableContent"

import EscrowDiagram from "./EscrowDiagram"

const closePoint = window.innerHeight / 2

function ProductView(props) {
  const productWindow = useRef()
  const windowContainer = useRef()
  const touchControl = useRef()
  const { setProductViewState } = props
  let {image, title, description} = props

  image = 'images/temp/product-single-thumbnail.png'
  title = 'Nike Adapt Self-Lacing Smart Sneaker'
  description = 'A breakthrough lacing system that electronically adjusts to the shape of your foot. Get the right fit, every game, every step.'

  const tableContent = [
    ['Category', 'Clothing'],
    ['Remaining Quantity', 1],
  ]

  const tableSeller = [
    ['Seller', 'David'],
    ['Phone', '1-415-542-5050'],
  ]

  const delta = {
    offset: 0,
    state: 0,
    end: 0
  }

  const clearDialog = () => {
    productWindow.current.removeAttribute('style');
    productWindow.current.style.transition = '0.4s ease-in-out'
    windowContainer.current.classList.remove('open')

    setTimeout(() => {
      setProductViewState(0)
    }, 400);
  }

  const dragControlerEnable = (e) => {
    productWindow.current.style.transition = 'none'
    delta.offset = e.clientY
    delta.state = 1
    productWindow.current.classList.add('noselect')
  }

  const dragControlerDisable = () => {
    if(!delta.state)
      return

    productWindow.current.style.transition = '0.4s ease-in-out'
    delta.state = 0

    productWindow.current.style.transform = delta.end > closePoint ?
    `translateY(100vh)` :
    `translateY(0px)`

    if(delta.end > closePoint) {
      clearDialog()
    }

    productWindow.current.classList.remove('noselect')
  }

  const dragControler = (e) => {
    delta.end = e.clientY - delta.offset

    if(delta.state)
      productWindow.current.style.transform = `translateY(${delta.end}px)`
  }

  const touchHandler = (e) => {
    e.preventDefault()
    delta.state = 2
    productWindow.current.style.transition = 'none'
    productWindow.current.classList.add('noselect')

    delta.end = e.touches[0].clientY - productWindow.current.offsetTop

    productWindow.current.style.transform = `translateY(${delta.end}px)`
  }

  useEffect(() => {
    setTimeout(() => {
      windowContainer.current.classList.add('open')
    }, 100)

    windowContainer.current.addEventListener('mousemove', dragControler, {passive: true})
    touchControl.current.addEventListener('touchmove', touchHandler, {passive: false})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      ref={windowContainer}
      className="product-view no-bg"
      onMouseLeave={dragControlerDisable}
      onMouseUp={dragControlerDisable}

      onTouchStart={dragControlerDisable}
      onTouchEnd={dragControlerDisable}
    >
      <div className="container erase">
        <div className="window" ref={productWindow}>
          <div className="drag-controler"
          onMouseDown={(e) => dragControlerEnable(e)}
          ref={touchControl}
          ></div>
          <div className="thumbnail flex center">
            <img className="mw100" src={image} alt={title} />
          </div>
          <div className="content">
            <div className="escrow-container">
              <EscrowDiagram status={'commited'} />
            </div>
            <div className="product-info">
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <div className="table location flex ai-center jc-sb">
              <p className="flex center"><IconLocation />Los Angeles</p>
              <div className="arrow expand"></div>
            </div>
            <div className="table product-info flex column">
              {tableContent.map(row => TableRow(row[0], row[1]))}
            </div>
            <div className="table price flex column">
              {PriceTable({payment: 0.1, buyerD: 0.02, sellerD: 0.01})}
            </div>
            <div className="table date flex jc-sb ai-center">
              {DateTable({start: '15/11/2020', expiry: '15/12/2020'})}
            </div>
            <div className="table product-info flex column">
              {tableSeller.map(row => TableRow(row[0], row[1]))}
            </div>
            <div className="button refund" role="button">REFUND</div>
          </div>
        </div>
      </div>
      <div className="hide-dialog" onClick={clearDialog}></div>
    </section>
  )
}

export default ProductView