import React from "react";

import "./CardBlock.scss";

function CardBlock(props) {
  const { category, image, background } = props;

  return (
    <div className={`card-block`}>
      <div
        className="card-container flex jc-sb ai-center"
        style={{ backgroundColor: background }}
      >
        <div className="text">
          <h2>{category}</h2>
        </div>
        <div className="image">
          <img src={image} alt={category} />
        </div>
      </div>
    </div>
  );
}

export default CardBlock;
