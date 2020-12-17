import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { BuyerContext, Buyer } from "../contexts/Buyer"
import { GlobalContext, Action } from "../contexts/Global"

import { DIC } from "../contexts/Dictionary"


import "./StaticPage.scss"

function ConnectToMetamask() {

  const buyerContext = useContext(BuyerContext)
  const globalContext = useContext(GlobalContext)

  const updateStatus = () => {
    globalContext.dispatch(Action.navigationControl(DIC.NAV.REDEEM))
    buyerContext.dispatch(Buyer.connectToMetamask())
  }

  return (
    <section className="connect-to-metamask static-page flex ai-center">
      <div className="container l">
        <div className="wrapper w100 relative flex column ai-center jc-sb">
          <Link to="/">
            <div className="cancel"><span className="icon"></span></div>
          </Link>
          <div className="info connect flex column ai-center">
            <div className="metamask-logo">
              <img src="images/metamask-logo.png" alt="MetaMask"/>
            </div>
            <p>Connect your Ethereum wallet to Boson Protocol</p>
          </div>
          <div className="button orange" role="button">
            <Link
            onClick={updateStatus}
            to="/">CONNECT TO METAMASK</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConnectToMetamask
