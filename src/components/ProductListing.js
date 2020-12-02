import React from 'react'

import ProductBlock from "../components/ProductBlock";
import { homeProducts } from "../PlaceholderAPI"

function ProductListing() {

  const getHomeProductSplice= (part) => {
    return part === 1 ?
    homeProducts.slice(0, Math.ceil(homeProducts.length / 2)) :
    homeProducts.slice(Math.ceil(homeProducts.length / 2), homeProducts.length)
  }

  return (
    <div className="home-products-listing col-grid">
      <div className="col-2">
        {getHomeProductSplice(1).map(block => <ProductBlock {...block} col />)}
      </div>
      <div className="col-2">
        {getHomeProductSplice(2).map(block => <ProductBlock {...block} col />)}
      </div>
    </div>
  )
}

export default ProductListing
