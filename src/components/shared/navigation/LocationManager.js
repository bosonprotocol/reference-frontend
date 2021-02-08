import { useContext, useEffect } from 'react'
import { useLocation } from "react-router"
import { NavigationContext, Action } from '../../../contexts/Navigation'

import { ROUTE, AFFMAP } from "../../../helpers/Dictionary"
import { updateBackgroundColor, bgColorPrimary, bgColorSecondary } from "../../../helpers/CSS"

// object affordances contains all of the available affordances assigned with false (don't show) by default
let affordances = { }

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
  updateBackgroundColor(bgColorPrimary)
}
callLocationAttributes[ROUTE.Connect] = () => {
  enableControl(controlset_1)
  updateBackgroundColor(bgColorPrimary)
}
callLocationAttributes[ROUTE.Activity] = () => {
  enableControl(controlset_2)
  updateBackgroundColor(bgColorPrimary)
}
callLocationAttributes[ROUTE.ActivityVouchers] = () => {
  enableControl(controlset_2)
  updateBackgroundColor(bgColorPrimary)
}
callLocationAttributes[ROUTE.VoucherDetails] =
callLocationAttributes[ROUTE.VoucherSetDetails] = () => {
  enableControl(controlset_1)
  updateBackgroundColor(bgColorSecondary)
}

// page not matching any
callLocationAttributes[ROUTE.Default] = () => {
  enableControl(controlset_1)
  updateBackgroundColor(bgColorPrimary)
}
// callLocationAttributes[ROUTE.NewOffer] = () => enableControl(controlset_1), // !TODO

const switchLocationMap = (pageRoute) => {
  // trigger a function that will enable relative affordances to the current page
  return callLocationAttributes[pageRoute] ? 
  callLocationAttributes[pageRoute]() : 
  callLocationAttributes[ROUTE.Default]()
}


function LocationManager() {
  const navigationContext = useContext(NavigationContext);

  const location = useLocation()

  const pageRoute = '/' + location.pathname.split('/')[1]

  useEffect(() => {
    affordances = {}
    Object.keys(AFFMAP).map(entryKey => console.log(entryKey))
    switchLocationMap(pageRoute)

    navigationContext.dispatch(Action.updateLocation())
    navigationContext.dispatch(Action.updateAffordances(
      affordances
    ))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return null
}

export default LocationManager
