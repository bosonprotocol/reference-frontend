import { createContext } from 'react'
import { DIC, CONTROL } from "../helpers/Dictionary"
// import { disableScroll, enableScroll } from "../helpers/ScrollManipulation"
import { getData as getContextData } from "../helpers/Context"

export const getData = getContextData

export const GlobalContext = createContext()

export const GlobalInitialState = {
  navigation: {
    state: DIC.NAV.DEF
  },
  qrReaderActivated: 0,
  onboardingCompleted: localStorage['onboarding-completed'],
  allVouchers: [],
  allVoucherSets: [],
  accountVouchers: [],
  fetchVoucherSets: 1,
  account: null,
};

export const Action = {
  openProduct: newId => ({
    type: DIC.OPEN_PRODUCT,
    payload: newId
  }),

  closeProduct: () => ({
    type: DIC.CLOSE_PRODUCT,
  }),

  navigationControl: (nav) => ({
    type: DIC.NAV.CONTROL,
    payload: nav
  }),

  toggleQRReader: (state) => ({
    type: DIC.ACTIVATE_QR_READER,
    payload: state
  }),

  allVoucherSets: (state) => ({
    type: DIC.ALL_VOUCHER_SETS,
    payload: state
  }),

  updateAllVouchers: (state) => ({
    type: DIC.ALL_VOUCHERS,
    payload: state
  }),

  accountVouchers: (state) => ({
    type: DIC.ACCOUNT_VOUCHERS,
    payload: state
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
    payload: val
  })
}

export const GlobalReducer = (state, action) => {
  const actionList = {
    [DIC.NAV.CONTROL]: () => {
      return {
        navigation: {
          state: action.payload
        }
      }
    },
    [DIC.ACTIVATE_QR_READER]: () => {
      return {
        qrReaderActivated: action.payload
      }
    },
    [DIC.ALL_VOUCHER_SETS]: () => {
      return {
        allVoucherSets: action.payload
      }
    },
    [DIC.ACCOUNT_VOUCHERS]: () => {
      return {
        accountVouchers: action.payload
      }
    },
    [DIC.UPDATE_ACCOUNT]: () => {
      return {
        account: action.payload
      }
    },
    [DIC.FETCH_VOUCHER_SETS]: () => {
      return {
        fetchVoucherSets: state.fetchVoucherSets * -1
      }
    },
    [DIC.ALL_VOUCHERS]: () => {
      return {
        allVouchers: action.payload
      }
    },
    [CONTROL.COMPLETE_ONBOARDING]: () => {
      console.log(action.payload)
      return {
        onboardingCompleted: action.payload === undefined ? true : false
      }
    },
  };

  return {
    ...state,
    ...actionList[action.type]()
  };
}