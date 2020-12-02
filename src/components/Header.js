import React from 'react'

import "./Header.scss"

function Header() {
  return (
    <header className="flex jc-sb ai-center">
      <h1><img src="images/boson-logo-nav.png" alt="Boson Protocol Logo"/></h1>
      <nav className="flex ai-center">
        <div className="search flex center" role="button"><img src="images/search-icon.svg" alt="Search"/> <p>Search</p></div>
        <div className="qr-icon" role="button"><img src="images/qr-icon.svg" alt="Scan QR"/></div>
      </nav>
    </header>
  )
}

export default Header
