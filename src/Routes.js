import React, { useContext } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AFFMAP, ROUTE } from "./helpers/configs/Dictionary";

import OnboardingReset from "./hooks/onboardingReset";
import TopNavigation from "./shared-components/navigation/top-navigation/TopNavigation";
import BottomNavigation from "./shared-components/navigation/bottom-navigation/BottomNavigation";
import LocationManager from "./shared-components/navigation/location-manager/LocationManager";
import NotFound from "./views/not-found/NotFound";
import { VoucherSetSupplyView } from "./views/activity/components/VoucherSetSupply";
import VoucherAndSetDetails from "./views/voucher-and-set-details/VoucherAndSetDetails";
import QRScanner from "./views/qr-scanner/QRScanner";
import Home from "./views/home/Home";
import ConnectWallet from "./views/connect-wallet/Connect-Wallet";
import ShowQR from "./views/show-qr/ShowQR";
import NewOffer from "./views/new-offer/NewOffer";

import { NavigationContext } from "./contexts/Navigation";
import GlobalListeners from "./hooks/globalListeners";
import { useExpiredTokenInterceptor } from "./hooks/useExpiredTokenInterceptor";
import Search from "./views/search/Search";
import PickUpLocation from "./views/pick-up-location/PickUpLocation";
import { OfferedVoucherSets } from "./views/activity/components/OfferedVoucherSets";
import { PurchasedVouchers } from "./views/activity/components/PurchasedVouchers";
import Docs  from "./views/documentation/Docs";

function Routes() {
  const navigationContext = useContext(NavigationContext);
  const displayNav = navigationContext.state.displayNavigation;
  const displayBottomNav = navigationContext.state.displayBottomNavigation;
  const displayBackButton =
    navigationContext.state.top[AFFMAP.BACK_BUTTON] ||
    navigationContext.state.top[AFFMAP.OFFER_FLOW_SET];
  const isHomePage = navigationContext.state.bottom.mainNavigationItem === 0;

  useExpiredTokenInterceptor();

  return (
    // class - dark|light; (default: dark)
    <div
      className={`emulate-mobile theme ${!displayBottomNav ? "no-bottom" : ""
        } ${!displayNav ? "disabled" : ""} ${displayBackButton || isHomePage ? "" : "hideTopNavigation"
        }`}
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
            component={VoucherSetSupplyView}
          />
          <Route path={ROUTE.Activity} component={OfferedVoucherSets} />
          <Route path={ROUTE.ActivityVouchers} component={PurchasedVouchers} />
          <Route path={ROUTE.Search} component={Search} />
          <Route path={ROUTE.PickUpLocation} component={PickUpLocation} />
          <Route exact path={ROUTE.Docs} component={Docs} />
          <Route component={NotFound} />
        </Switch>
        <BottomNavigation />
      </Router>
    </div>
  );
}

export default Routes;
