import React from 'react'

import "./EscrowDiagram.scss"

function EscrowDiagram() {
  // const escrowData = [
  //   'PAYMENT': 
  // ]

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
            <EscrowRow title='aaa' value='vvv' />
          </div>
        </div>
      </div>
    </section>
  )
}

const EscrowRow = (props) => {
  const { title, value } = props

  return (
    <div className="body-row flex ai-center">
      <div className="cell title">{title}</div>
      <div className="cell flex relative">
        <div className="val">{value}</div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  )
}

export default EscrowDiagram
 