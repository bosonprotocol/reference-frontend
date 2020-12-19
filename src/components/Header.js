import React, { useContext } from 'react'

import { Link } from 'react-router-dom'

import { GlobalContext, Action } from '../contexts/Global'

import "./Header.scss"

import { IconList, IconQR } from "./Icons"
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "../utils";

function Header() {
    const globalContext = useContext(GlobalContext);
    const { account } = useWeb3React();

    return (
        <header className="flex jc-sb ai-center">
            <h1><img src="images/boson-logo-nav.png" alt="Boson Protocol Logo"/></h1>
            <nav className="flex ai-center">
                <Link to="/connect">
                    <div className="button primary"
                         role="button">{ account ? shortenAddress(account) : 'Connect' }</div>
                </Link>
                <div className="search flex center" role="button"><IconList/>
                    <p>Search</p></div>
                <div className="qr-icon" role="button"
                     onClick={ () => globalContext.dispatch(Action.toggleQRReader(1)) }><IconQR/></div>
            </nav>
        </header>
    )
}

export default Header
