import { useContext, useEffect } from 'react'
import { useLocation } from "react-router"
import { NavigationContext, Action } from '../../../contexts/Navigation'

import { ROUTE, AFFMAP } from "../../../helpers/Dictionary"

// object affordances contains all of the available affordances assigned with false (don't show) by default
const affordances = { }

// recieve an array with affordances that should be dispplayed
const enableControl = (affordancesArray) => {
  return affordancesArray.forEach(toggle => affordances[toggle] = true)
}

const variation_1 = [AFFMAP.BACK_BUTTON]
const variation_2 = [AFFMAP.BACK_BUTTON, AFFMAP.QR_CODE_READER]
const variation_3 = [AFFMAP.WALLET_CONNECTION, AFFMAP.QR_CODE_READER]

// describe which affordances are available for the current page
const locationMap = {
  [ROUTE.Home]: () => enableControl(variation_3),
  [ROUTE.Connect]: () => enableControl(variation_1),
  // [ROUTE.NewOffer]: () => enableControl(variation_1), // !TODO
  [ROUTE.Activity]: () => enableControl(variation_2),
  [ROUTE.ActivityVouchers]: () => enableControl(variation_2),
  [ROUTE.VoucherDetails]: () => enableControl(variation_1),

  // page not matching any
  [ROUTE.Default]: () => enableControl(variation_1)
}

const switchLocationMap = (pageRoute) => {
  // trigger a function that will enable relative affordances to the current page
  return locationMap[pageRoute] ? 
  locationMap[pageRoute]() : 
  locationMap[ROUTE.Default]()
}


function LocationManager() {
  const navigationContext = useContext(NavigationContext);

  const location = useLocation()

  const pageRoute = '/' + location.pathname.split('/')[1]

  useEffect(() => {
    Object.keys(AFFMAP).map(entryKey => affordances[entryKey] = false)
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
