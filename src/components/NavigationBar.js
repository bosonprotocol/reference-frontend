import React from 'react'

import "./NavigationBar.scss"

import { IconAccount, IconAdd, IconList } from "./Icons"

function NavigationBar(props) {
  const {delay} = props
  return (
    <nav className="navigation-bar flex">
      <div className="nav-container flex center">
        <div className="control list flex center" role="button">
          <IconList />
        </div>
        <div className="control add-product flex center animate" role="button" style={{transitionDelay: delay}}>
          <IconAdd />
        </div>
        <div className="control account flex center" role="button">
          <IconAccount />
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar
