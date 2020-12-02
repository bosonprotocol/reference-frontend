import React from 'react'

import "./ProductBlock.scss"

function ProductBlock(props) {
  const {title, image, price, deposit, col} = props
  const productType = col ? "col" : ""

  return (
    <div className={`product-block ${productType}`}>
      <div className={`product-image flex center ${productType}`}>
        <img src={image} alt={title}/>
      </div>
      <h3>{title}</h3>
      <div className="price flex ai-center">
        <span><img src="images/eth-icon.svg" alt="Ethers"/> {price} ETH</span>
        <span><img src="images/deposit-icon.svg" alt="Deposit"/> {deposit} ETH</span>
      </div>
    </div>
  )
}

export default ProductBlock
