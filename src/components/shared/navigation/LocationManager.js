import { useContext, useEffect } from 'react'
import { useLocation } from "react-router"
import { NavigationContext, Action } from '../../../contexts/Navigation'

import { ROUTE, AFFMAP, BOTTOM_NAV_TYPE } from "../../../helpers/Dictionary"
import { updateBackgroundColor, bgColorPrimary, bgColorSecondary, bgColorBlack } from "../../../helpers/CSS"

// object affordances contains all of the available affordances assigned with false (don't show) by default
let affordances = { }
let bottomNavCurrent = -1

// recieve an array with affordances that should be dispplayed
const enableControl = (affordancesArray) => {
  return affordancesArray.forEach(toggle => affordances[toggle] = true)
}

const controlset_1 = [AFFMAP.BACK_BUTTON]
const controlset_2 = [AFFMAP.BACK_BUTTON, AFFMAP.QR_CODE_READER]
const controlset_3 = [AFFMAP.WALLET_CONNECTION, AFFMAP.QR_CODE_READER]

// describe which affordances are available for the current page
const callLocationAttributes = { }
callLocationAttributes[ROUTE.Home] = () => {
  enableControl(controlset_3)
  updateBackgroundColor(bgColorBlack)
  bottomNavCurrent = 0
}
callLocationAttributes[ROUTE.Connect] = () => {
  enableControl(controlset_1)
  updateBackgroundColor(bgColorBlack)
  bottomNavCurrent = 4
}
callLocationAttributes[ROUTE.Activity] = () => {
  enableControl(controlset_2)
  updateBackgroundColor(bgColorBlack)
  bottomNavCurrent = 3
}
callLocationAttributes[ROUTE.ActivityVouchers] = () => {
  enableControl(controlset_2)
  updateBackgroundColor(bgColorBlack)
  bottomNavCurrent = 1
}
callLocationAttributes[ROUTE.VoucherDetails] =
callLocationAttributes[ROUTE.VoucherSetDetails] = () => {
  enableControl(controlset_1)
  updateBackgroundColor(bgColorSecondary)
  bottomNavCurrent = -1
}

// page not matching any
callLocationAttributes[ROUTE.Default] = () => {
  updateBackgroundColor(bgColorPrimary)
  
}
callLocationAttributes[ROUTE.NewOffer] = () => {
  enableControl([AFFMAP.OFFER_FLOW_SET])
}


function LocationManager() {
  const navigationContext = useContext(NavigationContext);

  const location = useLocation()

  const pageRoute = '/' + location.pathname.split('/')[1]

  const switchLocationMap = (pageRoute) => {
    if(pageRoute === ROUTE.NewOffer) {
      navigationContext.dispatch(Action.setBottomNavType(BOTTOM_NAV_TYPE.OFFER)) 
    } 
    else if(pageRoute === ROUTE.VoucherDetails || pageRoute === ROUTE.VoucherSetDetails) {
      navigationContext.dispatch(Action.setBottomNavType(BOTTOM_NAV_TYPE.VOUCHER))
    }
    else {
      navigationContext.dispatch(Action.setBottomNavType(BOTTOM_NAV_TYPE.DEFAULT))
    }

    // trigger a function that will enable relative affordances to the current page
    return callLocationAttributes[pageRoute] ? 
    callLocationAttributes[pageRoute]() : 
    callLocationAttributes[ROUTE.Default]()
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    affordances = {}
    switchLocationMap(pageRoute)

    navigationContext.dispatch(Action.bottomNavListSelectedItem(bottomNavCurrent))

    navigationContext.dispatch(Action.updateLocation())
    navigationContext.dispatch(Action.updateAffordances(
      affordances
    ))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return null
}

export default LocationManager
