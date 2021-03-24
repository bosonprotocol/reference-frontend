import { createContext } from 'react'
import { DIC } from "../helpers/Dictionary"
import { getData as getContextData } from "../helpers/Context"

export const getData = getContextData

export const SellerContext = createContext()


const fetchProgressFallback = parseInt(localStorage.getItem('offeringProgress'))

export const SellerInitialState = {
  offeringProgress: fetchProgressFallback ? fetchProgressFallback : 0,
  offeringData: {
    price_currency: 'ETH',
    deposits_currency: 'ETH',
  }
};

export const Seller = {
  setOfferingProgress: (value) => ({
    type: DIC.SET_OFFERING_PROGRESS,
    payload: value
  }),
  updateOfferingData: (datatObject) => ({
    type: DIC.UPDATE_OFFERING_DATA,
    payload: datatObject
  }),
  loadOfferingBackup: () => ({
    type: DIC.LOAD_OFFERING_BACKUP
  }),
  getOfferingProgress: () => ({
    type: DIC.GET_OFFERING_PROGRESS
  }),
  resetOfferingData: () => ({
    type: DIC.RESET_OFFERING_DATA
  }),
}

export const SellerReducer = (state, action) => {
  const actionList = {

    [DIC.SET_OFFERING_PROGRESS]: () => {


      return {
        offeringProgress: action.payload
      }
    },

    [DIC.UPDATE_OFFERING_DATA]: () => {
      let update = {
        ...state.offeringData,
        ...action.payload
      }
      return {
        offeringData: update
      }
    },

    [DIC.LOAD_OFFERING_BACKUP]: () => ({
      offeringData: JSON.parse(localStorage.getItem('offeringData'))
    }),

    [DIC.GET_OFFERING_PROGRESS]: () => ({
      offeringProgress: parseInt(localStorage.getItem('offeringProgress'))
    }),

    [DIC.RESET_OFFERING_DATA]: () => ({
      offeringData: {},
      offeringProgress: 0
    }),

  };

  return {...state, ...actionList[action.type]()};
}
