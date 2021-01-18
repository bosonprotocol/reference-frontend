import React, { useContext } from 'react'

import { Link } from 'react-router-dom'

import { GlobalContext, Action } from '../../../contexts/Global'

import "./TopNavigation.scss"

import { IconQR } from "../../shared/Icons"
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "../../../utils";
import { injected, walletconnect } from "../../../connectors";
import MetaMaskLogo from "../../../images/metamask.png";
import WalletConnectLogo from "../../../images/walletconnect.svg";

function TopNavigation() {
  const globalContext = useContext(GlobalContext);
  const { account, connector } = useWeb3React();
  
  return (
    <header className="top-navigation">
      <div className="container">
        <nav className="flex jc-sb ai-center">
          <HomeNavigation 
            account={account}
            connector={connector}
            globalContext={globalContext}
          />
        </nav>
      </div>
    </header>
  )
}

const HomeNavigation = (props) => {
  const { account, connector, globalContext } = props
  return (
    <>
      <Link to="/connect">
      {account ? 
        <div className="button flex ai-center connected-account-button"
        role="button">
          <img
          className="provider-logo"
          src={ connector === injected ? MetaMaskLogo : connector === walletconnect ? WalletConnectLogo : null }
          alt="Connected account"/>
          <div className="active-wallet-indicator flex">
            <img src="images/active-wallet.png"
            alt="Active wallet"/>
          </div>
          <span>{ shortenAddress(account) }</span>
        </div>
        :
        <div className="button linear"
        role="button">Connect to a wallet</div> }
      </Link>
      <div className="qr-icon" role="button"
      onClick={ () => globalContext.dispatch(Action.toggleQRReader(1)) }><IconQR/></div>
    </>
  )
}

export default TopNavigation
