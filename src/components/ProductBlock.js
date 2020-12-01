import React from 'react'

import "./ProductBlock.scss"

function ProductBlock() {
  return (
    <div className="product-block">
      <div className="product-image flex center">
        <img src="images/product-block-image-temp.png" alt="{Title}"/>
      </div>
      <h2>Nike Air</h2>
      <div className="price flex ai-center">
        <span><img src="images/eth-icon.svg" alt="Ethers"/> 0.3 ETH</span>
        <span><img src="images/deposit-icon.svg" alt="Deposit"/> 0.02 ETH</span>
      </div>
    </div>
  )
}

export default ProductBlock
