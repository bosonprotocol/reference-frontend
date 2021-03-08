import React, { useContext } from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ROUTE } from "./helpers/Dictionary"

import OnboardingReset from "./views/OnboardingReset"
import ConnectToMetamask from "./views/ConnectToMetamask"
import TopNavigation from "./components/shared/navigation/TopNavigation"
import BottomNavigation from "./components/shared/navigation/BottomNavigation"
import LocationManager from "./components/shared/navigation/LocationManager"
import NotFound from "./views/NotFound"
import { ActivityVoucherSets, ActivityAccountVouchers } from "./views/Activity"
import VoucherDetails from "./views/VoucherDetails"
import QRScanner from "./views/QRScanner"
import Home from './views/Home'
import Connect from "./views/Connect";
import ShowQR from "./views/ShowQR"
import NewOffer from "./views/NewOffer"

import { NavigationContext } from "./contexts/Navigation"

function Routes() {
  const navigationContext = useContext(NavigationContext)
  const displayNav = navigationContext.state.displayNavigation
  const displayBottomNav = navigationContext.state.displayBottomNavigation
  return (
    // class - dark|light; (default: dark)
    <div className={`emulate-mobile theme ${!displayBottomNav ? 'no-bottom' : ''} ${!displayNav ? 'disabled' : ''}`}>
      <Router>
          <LocationManager />
          <TopNavigation />
          <Switch>
              <Route exact path={ ROUTE.CodeScanner } component={ QRScanner }/>
              <Route exact strict path={ ROUTE.Connect } component={ Connect }/>
              <Route exact path={ ROUTE.Home } component={ Home }/>
              <Route path="/onboarding" component={ OnboardingReset }/> {/* delete on prod */ }
              <Route path={ ROUTE.ConnectToMetamask } component={ ConnectToMetamask }/>
              <Route path={ ROUTE.NewOffer } component={ NewOffer }/>
              <Route path={ ROUTE.ActivityVouchers + ROUTE.PARAMS.ID + ROUTE.VoucherQRCode } component={ ShowQR }/>
              <Route path={ ROUTE.ActivityVouchers + ROUTE.PARAMS.ID } component={ VoucherDetails }/>
              <Route path={ ROUTE.Activity + ROUTE.PARAMS.ID } component={ VoucherDetails }/>
              <Route path={ ROUTE.Activity } component={ ActivityVoucherSets }/>
              <Route path={ ROUTE.ActivityVouchers } component={ ActivityAccountVouchers }/>

              <Route component={ NotFound } />
          </Switch>
          <BottomNavigation />
      </Router>
    </div>
  )
}

export default Routes
