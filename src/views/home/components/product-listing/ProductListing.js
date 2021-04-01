import React from "react";

import ProductBlock from "../product-block/ProductBlock";

import Masonry from "react-masonry-css";
import "./ProductListing.scss";

import { productAPI } from "../../../../PlaceholderAPI";

function ProductListing(props) {
  const { animateEl, animateDel } = props;

  const breakpointColumns = {
    default: 3,
    960: 2,
  };

  return (
    <div className="home-products-listing">
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {productAPI.map((block, id) => (
          <ProductBlock
            col
            key={id}
            {...block}
            delay={`${(id + animateDel) * 50}ms`}
            animate={id < animateEl}
          />
        ))}
      </Masonry>
    </div>
  );
}

export default ProductListing;
