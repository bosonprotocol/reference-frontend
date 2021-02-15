import React, { useContext, useEffect } from 'react'

import { useHistory } from "react-router"

import { Link } from 'react-router-dom'

import { NavigationContext } from '../../../contexts/Navigation'
import { GlobalContext } from '../../../contexts/Global'

import { AFFMAP, ROUTE } from "../../../helpers/Dictionary"

import "./TopNavigation.scss"

import { IconQR, Arrow } from "../../shared/Icons"
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "../../../utils";
import { injected, walletconnect } from "../../../connectors";
import MetaMaskLogo from "../../../images/metamask.png";
import WalletConnectLogo from "../../../images/walletconnect.svg";

import OfferFlowSet from "./OfferFlowSet"

function TopNavigation() {
  const navigationContext = useContext(NavigationContext);
  const globalContext = useContext(GlobalContext);
  const history = useHistory()

  const { account, connector } = useWeb3React();

  useEffect(() => {
    console.log(globalContext.state.onboardingCompleted)
  }, [globalContext.state.onboardingCompleted])

  return (
    <header className={`top-navigation ${!globalContext.state.onboardingCompleted ? 'd-none' : ''}`}>
      <div className="container">
        <nav className="flex split">

          {/* Wallet Connection Button */}
          { navigationContext.state.top[AFFMAP.WALLET_CONNECTION] ?
            <WalletConnection 
            account={account}
            connector={connector}
            />
          : null}

          {/* Back button */}
          { navigationContext.state.top[AFFMAP.BACK_BUTTON] ?
            <div className="button square new" role="button"
            onClick={ () => history.push(ROUTE.Home) } >
              <Arrow color="#80F0BE"/>
            </div>
          : null}

          {/* QR Reader button */}
          { navigationContext.state.top[AFFMAP.QR_CODE_READER] ?
            <Link to={ROUTE.CodeScanner} >
              <div className="qr-icon" role="button"><IconQR color="#8393A6" noBorder/></div>
            </Link>
          : null}

          {/* NewOffer Set */}
          { navigationContext.state.top[AFFMAP.OFFER_FLOW_SET] ?
            <OfferFlowSet />
          : null}

        </nav>
      </div>
    </header>
  )
}



const WalletConnection = (props) => {
  const { account, connector } = props
  return (
    <Link to={ROUTE.Connect}>
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
  )
}

export default TopNavigation
