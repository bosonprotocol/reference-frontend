import { createContext } from "react";
import { DIC, CONTROL } from "../helpers/configs/Dictionary";
import { getData as getContextData } from "../helpers/ContextHelper";

export const getData = getContextData;

export const GlobalContext = createContext();

export const GlobalInitialState = {
  qrReaderActivated: 0,
  onboardingCompleted: localStorage["onboarding-completed"],
  allVouchers: undefined,
  allVoucherSets: undefined,
  fetchVoucherSets: 1,
  account: null,
  checkDataUpdate: 1, //todo not sure if this is used. Might not be needed / could be removed
  checkAccountUpdate: 1,
  selectedCity: null,
};

export const Action = {
  toggleQRReader: (state) => ({
    type: DIC.ACTIVATE_QR_READER,
    payload: state,
  }),

  allVoucherSets: (state) => ({
    type: DIC.ALL_VOUCHER_SETS,
    payload: state,
  }),

  fetchVoucherSets: () => ({
    type: DIC.FETCH_VOUCHER_SETS,
  }),

  updateAccount: (account) => ({
    type: DIC.UPDATE_ACCOUNT,
    payload: account,
  }),

  completeOnboarding: (val) => ({
    type: CONTROL.COMPLETE_ONBOARDING,
    payload: val,
  }),

  checkDataUpdate: () => ({
    type: CONTROL.CHECK_DATA_UPDATE,
  }),
  updateVoucherSetsByLocation: (city, filteredVoucherSets) => ({
    type: DIC.UPDATE_VOUCHER_SETS_BY_LOCATION,
    payload: {
      city,
      filteredVoucherSets,
    },
  }),
};

export const GlobalReducer = (state, action) => {
  const actionList = {
    [DIC.NAV.CONTROL]: () => {
      return {
        navigation: {
          state: action.payload,
        },
      };
    },
    [DIC.ACTIVATE_QR_READER]: () => {
      return {
        qrReaderActivated: action.payload,
      };
    },
    [DIC.ALL_VOUCHER_SETS]: () => {
      return {
        allVoucherSets: action.payload,
      };
    },
    [DIC.UPDATE_ACCOUNT]: () => {
      return {
        account: action.payload,
        checkAccountUpdate: state.checkAccountUpdate * -1,
      };
    },
    [DIC.FETCH_VOUCHER_SETS]: () => {
      return {
        fetchVoucherSets: state.fetchVoucherSets * -1,
      };
    },
    [DIC.ALL_VOUCHERS]: () => {
      return {
        allVouchers: action.payload,
      };
    },
    [CONTROL.COMPLETE_ONBOARDING]: () => {
      return {
        onboardingCompleted: action.payload === undefined ? true : false,
      };
    },
    [CONTROL.CHECK_DATA_UPDATE]: () => {
      return {
        checkDataUpdate: state.checkDataUpdate * -1,
      };
    },
    [DIC.UPDATE_VOUCHER_SETS_BY_LOCATION]: () => {
      return {
        selectedCity: action.payload.city,
        allVoucherSets: action.payload.filteredVoucherSets,
      };
    },
  };

  return {
    ...state,
    ...actionList[action.type](),
  };
};
