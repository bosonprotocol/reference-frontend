import React, { useState, useEffect, useContext } from 'react'

import "./NavigationBar.scss"

import { IconAccount, IconAdd, IconList } from "./Icons"

import { GlobalContext } from "../contexts/Global"
import { BuyerContext, Buyer } from "../contexts/Buyer"
import { DIC } from "../contexts/Dictionary"


function NavigationBar(props) {
  const globalContext = useContext(GlobalContext)
  const buyerContext = useContext(BuyerContext)
  const [transitionState, setTransitionState] = useState(0)
  const [transitionTrigger, setTransitionTrigger] = useState(0)

  const {delay} = props
  const aniamtionTimout = 300

  useEffect(() => {
    
    // use this to compare {previus} screen and {current} screen
    // setTransitionTrigger(transitionState)
    setTransitionTrigger('out')

    setTimeout(() => {
      setTransitionState(globalContext.state.navigation.state)
      setTransitionTrigger('in')
    }, aniamtionTimout);
  }, [globalContext.state.navigation.state])

  return (
    <nav className={`navigation-bar flex ${transitionState} ${transitionTrigger}`}>
      <div className="nav-container flex center">
        {transitionState === DIC.NAV.DEF ?
          <div className={`control-wrap flex center ${DIC.NAV.DEF}`}>
            <div className="control list flex center" role="button">
            <IconList />
            </div>
            <div className="control add-product flex center animate" role="button" style={{transitionDelay: delay}}>
              <IconAdd />
            </div>
            <div className="control account flex center" role="button">
              <IconAccount />
            </div>
          </div> : null
        }
        {transitionState === DIC.NAV.COMMIT ?
          <div className={`control-wrap ${DIC.NAV.COMMIT}`}>
            <div className="control commit flex center" role="button"
              onClick={() => buyerContext.dispatch(Buyer.commitToBuy())}
            >
              <p>COMMIT TO BUY 0.1 ETH</p>
            </div>
          </div> : null
        }
        {transitionState === 'add later' ?
          <div className="control-wrap">
            <div className="control list flex center" role="button">
              COMMITED
            </div>
          </div> : null
        }
      </div>
    </nav>
  )
}

export default NavigationBar 
