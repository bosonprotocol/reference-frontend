import React, { useContext } from 'react'

import { Link } from 'react-router-dom'

import { GlobalContext, Action } from '../../contexts/Global'

import { IconQR } from "../shared/Icons"
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "../../utils";
import { injected, walletconnect } from "../../connectors";
import MetaMaskLogo from "../../images/metamask.png";
import WalletConnectLogo from "../../images/walletconnect.svg";

function Header() {
    const globalContext = useContext(GlobalContext);
    const { account, connector } = useWeb3React();

    return (
        <header className="flex jc-sb ai-center">
            {/*<h1><img src="images/boson-logo-nav.png" alt="Boson Protocol Logo"/></h1>*/ }
            <nav className="flex jc-sb ai-center">
                <Link to="/connect">
                    { account ? <div className="button flex ai-center connected-account-button"
                                     role="button">
                            <img
                                className="provider-logo"
                                src={ connector === injected ? MetaMaskLogo : connector === walletconnect ? WalletConnectLogo : null }
                                alt="Connected account"/>
                            <div className="active-wallet-indicator flex">
                                <img src="images/active-wallet.png"
                                     alt="Active wallet"/>
                                <div/>
                            </div>
                            <span>{ shortenAddress(account) }</span></div> :
                        <div className="button linear"
                             role="button">Connect to a wallet</div> }
                </Link>
                {/*<div className="search flex center" role="button"><IconList/>*/ }
                {/*    <p>Search</p></div>*/ }
                <div className="qr-icon" role="button"
                     onClick={ () => globalContext.dispatch(Action.toggleQRReader(1)) }><IconQR/></div>
            </nav>
        </header>
    )
}

export default Header
