import React, { useContext } from 'react'

import { NavigationContext } from '../../../contexts/Navigation'
import { Arrow } from "../../shared/Icons"

function OfferFlowSet() {
  const navigationContext = useContext(NavigationContext)
  const { activeScreen, setActiveScreen, screens} = navigationContext.state.offerFlowControl

  return (
    <div className="top-navigation-offer flex ai-center">
      <div className="button square" role="button"
        onClick={() => setActiveScreen(activeScreen - 1, activeScreen === 0)} >
        <Arrow />
      </div>
      <div className="progress-bar flex center">
        {screens.map((screen, id) => <div
          key={id} role="button"
          className={`bar ${id <= activeScreen ? 'fill' : ''}`}
          ><span></span></div>)}
      </div>
    </div>
  )
}

export default OfferFlowSet
