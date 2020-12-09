import React, { useState } from 'react'

import "./NavigationBar.scss"

import { IconAccount, IconAdd, IconList } from "./Icons"

function NavigationBar(props) {
  const [control] = useState(false)
  const {delay} = props

  return (
    <nav className={`navigation-bar flex ${control && 'special'}`}>
      <div className="nav-container flex center">
        {!control ?
          <>
            <div className="control list flex center" role="button">
            <IconList />
            </div>
            <div className="control add-product flex center animate" role="button" style={{transitionDelay: delay}}>
              <IconAdd />
            </div>
            <div className="control account flex center" role="button">
              <IconAccount />
            </div>
          </> : null
        }
        {control === 'commit' ?
          <div className="control commit flex center" role="button">
            <p>COMMIT TO BUY 0.1 ETH</p>
          </div> : null
        }
        {control === 'redeem' ?
          <div className="control list flex center" role="button">
          <IconList />
          </div> : null
        }
      </div>
    </nav>
  )
}

export default NavigationBar
