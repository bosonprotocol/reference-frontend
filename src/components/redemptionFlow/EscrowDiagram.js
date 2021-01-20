import React from 'react'

import "./EscrowDiagram.scss"

function EscrowDiagram() {
  
  const escrowData = {
    PAYMENT: {
      title: 'PAYMENT',
      value: '0.1 ETH',
      position: 2,
    },
    BUYER_DEPOSIT: {
      title: 'BUYER DEPOSIT',
      value: '0.02 ETH',
      position: 2,
    },
    SELLER_DEPOSIT: {
      title: 'SELLER DEPOSIT',
      value: '0.01 ETH',
      position: 2,
    },
  }

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
            {Object.values(escrowData).map(row => <EscrowRow { ...row } />)}
          </div>
        </div>
      </div>
    </section>
  )
}

const EscrowRow = (props) => {
  const { title, value, position } = props

  return (
    <div className="body-row flex ai-center">
      <div className="cell title">{title}</div>
      <div className="cell flex relative">
        <div className={`val position _${position}`}>{value}</div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  )
}

export default EscrowDiagram
 