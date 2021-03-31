import React, { useContext } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ROUTE } from "./helpers/Dictionary";

import OnboardingReset from "./hooks/OnboardingReset";
import TopNavigation from "./components/shared/navigation/top-navigation/TopNavigation";
import BottomNavigation from "./components/shared/navigation/bottom-navigation/BottomNavigation";
import LocationManager from "./components/shared/navigation/location-manager/LocationManager";
import NotFound from "./views/not-found/NotFound";
import {
  ActivityVoucherSets,
  ActivityAccountVouchers,
  ActivityVoucherSetView,
} from "./views/activity/Activity";
import VoucherAndSetDetails from "./views/voucher-and-set-details/VoucherAndSetDetails";
import QRScanner from "./views/qr-scanner/QRScanner";
import Home from "./views/home/Home";
import ConnectWallet from "./views/connect-wallet/Connect-Wallet";
import ShowQR from "./views/show-qr/ShowQR";
import NewOffer from "./views/new-offer/NewOffer";

import { NavigationContext } from "./contexts/Navigation";
import GlobalListeners from "./hooks/GlobalListeners";
import { useExpiredTokenResponseInterceptor } from "./hooks/useExpiredTokenResponseInterceptor";

function Routes() {
  const navigationContext = useContext(NavigationContext);
  const displayNav = navigationContext.state.displayNavigation;
  const displayBottomNav = navigationContext.state.displayBottomNavigation;

  useExpiredTokenResponseInterceptor();

  return (
    // class - dark|light; (default: dark)
    <div
      className={`emulate-mobile theme ${
        !displayBottomNav ? "no-bottom" : ""
      } ${!displayNav ? "disabled" : ""}`}
    >
      <Router>
        <LocationManager />
        <TopNavigation />
        <GlobalListeners />
        <Switch>
          <Route exact path={ROUTE.CodeScanner} component={QRScanner} />
          <Route exact strict path={ROUTE.Connect} component={ConnectWallet} />
          <Route exact path={ROUTE.Home} component={Home} />
          <Route path="/onboarding" component={OnboardingReset} />{" "}
          {/* delete on prod */}
          <Route path={ROUTE.NewOffer} component={NewOffer} />
          <Route
            path={
              ROUTE.ActivityVouchers + ROUTE.PARAMS.ID + ROUTE.VoucherQRCode
            }
            exact
            component={ShowQR}
          />
          <Route
            path={ROUTE.ActivityVouchers + ROUTE.PARAMS.ID + ROUTE.Details}
            exact
            component={VoucherAndSetDetails}
          />
          <Route
            path={ROUTE.Activity + ROUTE.PARAMS.ID + ROUTE.Details}
            exact
            component={VoucherAndSetDetails}
          />
          <Route
            path={ROUTE.Activity + ROUTE.PARAMS.ID + ROUTE.VoucherSetView}
            exact
            component={ActivityVoucherSetView}
          />
          <Route path={ROUTE.Activity} component={ActivityVoucherSets} />
          <Route
            path={ROUTE.ActivityVouchers}
            component={ActivityAccountVouchers}
          />
          <Route component={NotFound} />
        </Switch>
        <BottomNavigation />
      </Router>
    </div>
  );
}

export default Routes;
