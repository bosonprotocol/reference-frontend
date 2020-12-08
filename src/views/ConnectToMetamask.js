import React from 'react'

import "./ConnectToMetamask.scss"

function ConnectToMetamask() {
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
          <div className="button orange" role="button">CONNECT TO METAMASK</div>
        </div>
      </div>
    </section>
  )
}

export default ConnectToMetamask
