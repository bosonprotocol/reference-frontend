import React, { useContext } from 'react'

import { GlobalContext, Action} from '../contexts/Global'

import "./Header.scss"

import { IconList, IconQR } from "./Icons"

function Header() {
  const globalContext = useContext(GlobalContext)

    return (
        <header className="flex jc-sb ai-center">
            <h1><img src="images/boson-logo-nav.png" alt="Boson Protocol Logo"/></h1>
            <nav className="flex ai-center">
                <div className="search flex center" role="button"><IconList/>
                    <p>Search</p></div>
                <div className="qr-icon" role="button" onClick={() => globalContext.dispatch(Action.toggleQRReader(1))}><IconQR/></div>
            </nav>
        </header>
    )
}

export default Header
