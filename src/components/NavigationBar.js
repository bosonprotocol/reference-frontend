import React, { useEffect, useContext } from 'react'

import "./NavigationBar.scss"

import { IconAccount, IconAdd, IconList } from "./Icons"

import { GlobalContext } from "../contexts/Global"
import { BuyerContext, Buyer } from "../contexts/Buyer"
import { DIC } from "../contexts/Dictionary"


function NavigationBar(props) {
  const {delay} = props
  const globalContext = useContext(GlobalContext)
  const buyerContext = useContext(BuyerContext)

  useEffect(() => {
    console.log('change')
  }, [globalContext.state.buyerStep, globalContext.state.productView.open])

  return (
    <nav className={`navigation-bar flex ${globalContext.state.productView.open && 'special'}`}>
      <div className="nav-container flex center">
        {!globalContext.state.productView.open ?
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
        {globalContext.state.productView.open && !buyerContext.state.buyerStep ?
          <div className="control commit flex center" role="button"
            onClick={() => buyerContext.dispatch(Buyer.commitToBuy())}
          >
            <p>COMMIT TO BUY 0.1 ETH</p>
          </div> : null
        }
        {globalContext.state.productView.open && buyerContext.state.buyerStep === DIC.COMMITED ?
          <div className="control list flex center" role="button">
          COMMITED
          </div> : null
        }
      </div>
    </nav>
  )
}

export default NavigationBar 
