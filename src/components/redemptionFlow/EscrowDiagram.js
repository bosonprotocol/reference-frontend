import React from 'react'

import "./EscrowDiagram.scss"

function EscrowDiagram() {
  return (
    <section className="escrow-diagram vertical">
      <div className="container flex center">
        <div className="semi-container">
          <div className="top-row flex ai-center jc-end">
            <div className="cell">BUYER</div>
            <div className="cell">BOSON ESCROW</div>
            <div className="cell">SELLER</div>
          </div>
          <div className="body">
            <div className="body-row flex ai-center">
              <div className="cell title">PAYMENT</div>
              <div className="cell flex relative">
                <div className="val">0.1 ETH</div>  {/* set value */}
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EscrowDiagram
 