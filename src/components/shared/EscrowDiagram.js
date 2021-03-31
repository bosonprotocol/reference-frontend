import React from "react";

import "./EscrowDiagram.scss";

function EscrowDiagram(props) {
  const { status } = props;

  return (
    // animate
    <div
      className={`diagram-content flex col-grid jc-sb slide-2 animate ${
        status ? status : "default"
      }`}
    >
      <div className="seller col-4 reduce-1">
        <div className="title">
          <p>Seller</p>
        </div>
        <div className="slot">
          <div className="block">
            <p className="name">DEPOSIT</p>
            <p className="value">0.01 ETH</p>
          </div>
        </div>
      </div>
      <div className="main col-2 reduce-1 flex column">
        <div className="title flex ai-center jc-center pad-last">
          <img
            src="images/boson/boson-logo-small.png"
            alt="Boson Logo"
            className="pe-none"
          />
          <p>Boson Escrow</p>
        </div>
        <div className="field flex wrap jc-sb exists">
          <div className="slot empty seller"></div>
          <div className="slot empty buyer"></div>
          <div className="slot empty non"></div>
          <div className="slot empty buyer"></div>
        </div>
      </div>
      <div className="buyer col-4 reduce-1">
        <div className="title">
          <p>Buyer</p>
        </div>
        <div className="slot">
          <div className="block">
            <p className="name">DEPOSIT</p>
            <p className="value">0.02 ETH</p>
          </div>
        </div>
        <div className="slot">
          <div className="block">
            <p className="name">PAYMENT</p>
            <p className="value">0.1 ETH</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EscrowDiagram;
