import React, { useContext } from 'react'

import "./ProductBlock.scss"

import { IconEth, IconDeposit } from "../shared/Icons"

import { GlobalContext, Action } from "../../contexts/Global"
import { DIC } from "../../helpers/Dictionary"


function ProductBlock(props) {
  const {id, title, image, price, deposit, col, delay, animate} = props
  const productType = col ? "col" : ""

  const globalContext = useContext(GlobalContext)

  const openProduct = () => {
    globalContext.dispatch(Action.openProduct(id))
    globalContext.dispatch(Action.navigationControl(DIC.NAV.COMMIT))
  }

  return (
    <div 
      onClick={openProduct}
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
