import React from 'react'

import { Link } from 'react-router-dom'

import "./Header.scss"
import { useStore } from "../hooks";

function Header() {
    const [, setQrReaderActivated] = useStore(["qrReaderActivated"]);


    const activateQrReader = () => {
        setQrReaderActivated(true)
    };

    return (
        <header className="flex jc-sb ai-center">
            <h1><img src="images/boson-logo-nav.png" alt="Boson Protocol Logo"/></h1>
            <nav className="flex ai-center">
                <Link to="/connect">
                    <div className="button primary" role="button">Connect</div> 
                </Link>
                <div className="search flex center" role="button"><img src="images/search-icon.svg" alt="Search"/>
                    <p>Search</p></div>
                <div className="qr-icon" role="button" onClick={ activateQrReader }><img src="images/qr-icon.svg" alt="Scan QR"/></div>
            </nav>
        </header>
    )
}

export default Header
