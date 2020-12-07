import React from 'react'

import "./NavigationBar.scss"

function NavigationBar(props) {
  const {delay} = props
  return (
    <nav className="navigation-bar flex">
      <div className="nav-container flex center">
        <div className="control list flex center" role="button">
          <img src="images/navbar-icon-list.svg" alt=""/>
        </div>
        <div className="control add-product flex center animate" role="button">
          <img src="images/navbar-icon-add.svg" alt="" style={{transitionDelay: delay}} />
        </div>
        <div className="control account flex center" role="button">
          <img src="images/navbar-icon-account.svg" alt=""/>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar
