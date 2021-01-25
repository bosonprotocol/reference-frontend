import React from 'react'

import { Link } from 'react-router-dom'

import { IconQR } from "../shared/Icons"
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "../../utils";
import { injected, walletconnect } from "../../connectors";
import MetaMaskLogo from "../../images/metamask.png";
import WalletConnectLogo from "../../images/walletconnect.svg";

import { ROUTE } from "../../helpers/Dictionary"

function Header() {
    const { account, connector } = useWeb3React();

    return (
        <header>
            {/*<h1><img src="images/boson-logo-nav.png" alt="Boson Protocol Logo"/></h1>*/ }
            <nav className="flex jc-sb ai-center td-none">
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
                <Link to={ROUTE.CodeScanner} >
                    <div className="qr-icon" role="button"><IconQR color="#8393A6" noBorder/></div>
                </Link>
            </nav>
        </header>
    )
}

export default Header
