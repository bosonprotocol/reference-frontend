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
      <div className="container">
        <div className="section-title flex split">
          <h2>Payment and Deposits</h2>
          <div className="info" role="button">?</div>
        </div>
        <div className="semi-container">
          <div className="top-row flex ai-center jc-end">
            <div className="cell set">BUYER</div>
            <div className="cell set">BOSON ESCROW</div>
            <div className="cell set">SELLER</div>
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

  const color = title !== 'SELLER DEPOSIT' ? '1' : '2'

  return (
    <div className="body-row flex ai-center">
      <div className={`block cell set title color_${color}`}>{title}</div>
      <div className="block flex relative">
        <div className={`cell val position_${position} color_${color}`}>{value}</div>
        <div className="cell"></div>
        <div className="cell"></div>
        <div className="cell"></div>
      </div>
    </div>
  )
}

export default EscrowDiagram
 