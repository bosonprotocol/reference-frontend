import React from 'react'

import ProductBlock from "../components/ProductBlock";

import Masonry from 'react-masonry-css'
import "./ProductListing.scss"

import { homeProducts } from "../PlaceholderAPI"

function ProductListing() {

  const breakpointColumns = {
    default: 3,
    960: 2,
  };

  return (
    <div className="home-products-listing">
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
        {homeProducts.map((block, id) => <ProductBlock col key={id} {...block} delay={`${(id + 5) * 50}ms`} animate={id < 6} />)}
      </Masonry>
    </div>
  )
}

export default ProductListing
