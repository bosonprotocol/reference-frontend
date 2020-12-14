import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { BuyerContext, Buyer } from "../contexts/Buyer"


import "./ConnectToMetamask.scss"

function ConnectToMetamask() {

  const buyerContext = useContext(BuyerContext)

  return (
    <section className="connect-to-metamask flex ai-center">
      <div className="container l">
        <div className="wrapper w100 relative flex column ai-center jc-sb">
          <div className="cancel"><span className="icon"></span></div>
          <div className="info flex column ai-center">
            <div className="metamask-logo">
              <img src="images/metamask-logo.png" alt="MetaMask"/>
            </div>
            <p>Connect your Ethereum wallet to Boson Protocol</p>
          </div>
          <div className="button orange" role="button">
            <Link
            onClick={() => buyerContext.dispatch(Buyer.connectToMetamask())}
             exact to="/">CONNECT TO METAMASK</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConnectToMetamask
