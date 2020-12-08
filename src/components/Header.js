import React from 'react'

import "./Header.scss"
import { useStore } from "../hooks";

import { IconList, IconQR } from "./Icons"

function Header() {
    const [, setQrReaderActivated] = useStore(["qrReaderActivated"]);


    const activateQrReader = () => {
        setQrReaderActivated(true)
    };

    return (
        <header className="flex jc-sb ai-center">
            <h1><img src="images/boson-logo-nav.png" alt="Boson Protocol Logo"/></h1>
            <nav className="flex ai-center">
                <div className="search flex center" role="button"><IconList /> 
                    <p>Search</p></div>
                <div className="qr-icon" role="button" onClick={ activateQrReader }><IconQR /></div>
            </nav>
        </header>
    )
}

export default Header
