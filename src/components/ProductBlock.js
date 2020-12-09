import React from 'react'

import "./ProductBlock.scss"

import { IconEth, IconDeposit } from "./Icons"


function ProductBlock(props) {
  const {title, image, price, deposit, col, delay, animate, setProductViewState} = props
  const productType = col ? "col" : ""

  return (
    <div 
      onClick={
        setProductViewState?
        () => setProductViewState(1) : undefined
      }
      className={`product-block ${productType}  ${animate ? 'animate' : ''}`}
    >
      <div className={`product-image flex center ${productType}`}>
        <img style={{transitionDelay: delay}} src={image} alt={title}/>
      </div>
      <h3>{title}</h3>
      <div className="price flex ai-center">
        <span><IconEth />{price} ETH</span>
        <span><IconDeposit /> {deposit} ETH</span>
      </div>
    </div>
  )
}

export default ProductBlock
