import { useContext, useEffect } from "react";
import { useLocation } from "react-router";
import {
  NavigationContext,
  NavigationAction,
} from "../../../contexts/Navigation";

import {
  ROUTE,
  AFFMAP,
  BOTTOM_NAV_TYPE,
} from "../../../helpers/configs/Dictionary";
import {
  updateBackgroundColor,
  bgColorPrimary,
  bgColorSecondary,
  bgColorBlack,
} from "../../../helpers/CSSHelper";

// object affordances contains all of the available affordances assigned with false (don't show) by default
let affordances = {};
let bottomLinksMap = {
  customControls: -1,
  [ROUTE.Home]: 0,
  [ROUTE.ActivityVouchers]: 1,
  [ROUTE.NewOffer]: 2,
  [ROUTE.Activity]: 3,
  [ROUTE.Connect]: 4,
};
let bottomNavActiveLink = -1;

// recieve an array with affordances that should be dispplayed
const enableControl = (affordancesArray) => {
  return affordancesArray.forEach((toggle) => (affordances[toggle] = true));
};

const controlset_1 = [AFFMAP.BACK_BUTTON];
const controlset_2 = [AFFMAP.BACK_BUTTON, AFFMAP.QR_CODE_READER];
const controlset_3 = [AFFMAP.WALLET_CONNECTION, AFFMAP.QR_CODE_READER];

// describe which affordances are available for the current page
const callLocationAttributes = {};
callLocationAttributes[ROUTE.Home] = () => {
  enableControl(controlset_3);
  updateBackgroundColor(bgColorBlack);
  bottomNavActiveLink = bottomLinksMap[ROUTE.Home];
};
callLocationAttributes[ROUTE.Connect] = () => {
  updateBackgroundColor(bgColorBlack);
  bottomNavActiveLink = bottomLinksMap[ROUTE.Connect];
};
callLocationAttributes[ROUTE.Activity] = (nested, param) => {
  if (param === "supply") {
    enableControl(controlset_1);
    updateBackgroundColor(bgColorBlack);
  } else if (nested) {
    enableControl(controlset_1);
    updateBackgroundColor(bgColorSecondary);
    bottomNavActiveLink = bottomLinksMap.customControls;
  } else {
    updateBackgroundColor(bgColorBlack);
    bottomNavActiveLink = bottomLinksMap[ROUTE.Activity];
  }
};
callLocationAttributes[ROUTE.ActivityVouchers] = (nested) => {
  if (nested) {
    enableControl(controlset_1);
    updateBackgroundColor(bgColorSecondary);
    bottomNavActiveLink = bottomLinksMap.customControls;
  } else {
    updateBackgroundColor(bgColorBlack);
    bottomNavActiveLink = bottomLinksMap[ROUTE.ActivityVouchers];
  }
};

// page not matching any
callLocationAttributes[ROUTE.Default] = () => {
  updateBackgroundColor(bgColorPrimary);
};
callLocationAttributes[ROUTE.NewOffer] = () => {
  enableControl([AFFMAP.OFFER_FLOW_SET]);
  updateBackgroundColor(bgColorBlack);
};

callLocationAttributes[ROUTE.Search] = () => {
  enableControl([AFFMAP.BACK_BUTTON]);
  updateBackgroundColor(bgColorBlack);
};

callLocationAttributes[ROUTE.PickUpLocation] = () => {
  enableControl([AFFMAP.BACK_BUTTON]);
  updateBackgroundColor(bgColorBlack);
};

function LocationManager() {
  const navigationContext = useContext(NavigationContext);

  const location = useLocation();

  const switchLocationMap = () => {
    const pageRoute = "/" + location.pathname.split("/")[1];
    const urlNested = location.pathname.split("/")[2];
    const param = location.pathname.split("/")[3];

    if (pageRoute === ROUTE.NewOffer) {
      navigationContext.dispatch(
        NavigationAction.setBottomNavType(BOTTOM_NAV_TYPE.OFFER)
      );
    } else if (
      (pageRoute === ROUTE.ActivityVouchers || pageRoute === ROUTE.Activity) &&
      !!urlNested
    ) {
      navigationContext.dispatch(
        NavigationAction.setBottomNavType(BOTTOM_NAV_TYPE.VOUCHER)
      );
    } else {
      navigationContext.dispatch(
        NavigationAction.setBottomNavType(BOTTOM_NAV_TYPE.DEFAULT)
      );
    }

    if (pageRoute === ROUTE.CodeScanner) {
      navigationContext.dispatch(NavigationAction.displayNavigation(false));
    } else {
      navigationContext.dispatch(NavigationAction.displayNavigation(true));
    }

    if (param === "qr" || param === "supply") {
      navigationContext.dispatch(
        NavigationAction.displayBottomNavigation(false)
      );
    } else {
      navigationContext.dispatch(
        NavigationAction.displayBottomNavigation(true)
      );
    }

    // trigger a function that will enable relative affordances to the current page
    return callLocationAttributes[pageRoute]
      ? callLocationAttributes[pageRoute](urlNested, param)
      : callLocationAttributes[ROUTE.Default]();
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    affordances = {};
    switchLocationMap();

    navigationContext.dispatch(
      NavigationAction.bottomNavListSelectedItem(bottomNavActiveLink)
    );

    navigationContext.dispatch(NavigationAction.updateLocation());
    navigationContext.dispatch(NavigationAction.updateAffordances(affordances));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return null;
}

export default LocationManager;
