import { createContext } from "react";
import { CONTROL, AFFMAP, BOTTOM_NAV_TYPE } from "../helpers/Dictionary";
import { getData as getContextData } from "../helpers/Context";

export const MAP = CONTROL;

export const getData = getContextData;

export const NavigationContext = createContext();

export const NavigationInitialState = {
  location: null,
  top: {
    [AFFMAP.WALLET_CONNECTION]: false,
    [AFFMAP.BACK_BUTTON]: false,
    [AFFMAP.QR_CODE_READER]: false,
    [AFFMAP.OFFER_FLOW_SET]: false,
  },
  bottom: {
    type: BOTTOM_NAV_TYPE.DEFAULT,
    mainNavigationItem: null,
  },
  offerFlowControl: false,
  redemptionFlowControl: false,
  displayNavigation: false,
  displayBottomNavigation: false,
};

export const Action = {
  updateLocation: (location) => ({
    type: CONTROL.UPDATE_LOCATION,
    payload: location,
  }),
  updateAffordances: (location) => ({
    type: CONTROL.UPDATE_AFFORDANCES,
    payload: location,
  }),
  bottomNavListSelectedItem: (item) => ({
    type: CONTROL.UPDATE_BOTTOM_NAV,
    payload: item,
  }),
  setFormNavigation: (object) => ({
    type: CONTROL.SET_FORM_NAVIGATION,
    payload: object,
  }),
  setRedemptionControl: (object) => ({
    type: CONTROL.SET_REDEMPTION_CONTROL,
    payload: object,
  }),
  setBottomNavType: (type) => ({
    type: CONTROL.SET_BOTTOM_NAV_TYPE,
    payload: type,
  }),
  displayNavigation: (type) => ({
    type: CONTROL.DISPLAY_NAVIGATION,
    payload: type,
  }),
  displayBottomNavigation: (type) => ({
    type: CONTROL.DISPLAY_BOTTOM_NAVIGATION,
    payload: type,
  }),
};

export const NavigationReducer = (state, action) => {
  const actionList = {
    [CONTROL.UPDATE_LOCATION]: () => {
      return {
        location: action.payload,
      };
    },
    [CONTROL.UPDATE_AFFORDANCES]: () => {
      return {
        top: action.payload,
      };
    },
    [CONTROL.SET_BOTTOM_NAV_TYPE]: () => {
      return {
        bottom: {
          ...state.bottom,
          type: action.payload,
        },
      };
    },
    [CONTROL.UPDATE_BOTTOM_NAV]: () => {
      return {
        bottom: {
          ...state.bottom,
          mainNavigationItem: action.payload,
        },
      };
    },
    [CONTROL.SET_FORM_NAVIGATION]: () => {
      return {
        offerFlowControl: action.payload,
      };
    },
    [CONTROL.SET_REDEMPTION_CONTROL]: () => {
      return {
        redemptionFlowControl: action.payload,
      };
    },
    [CONTROL.DISPLAY_NAVIGATION]: () => {
      return {
        displayNavigation: action.payload,
      };
    },
    [CONTROL.DISPLAY_BOTTOM_NAVIGATION]: () => {
      return {
        displayBottomNavigation: action.payload,
      };
    },
  };

  return { ...state, ...actionList[action.type]() };
};
