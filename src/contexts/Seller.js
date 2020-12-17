import { createContext } from 'react'
import { DIC } from "../helpers/Dictionary"

export const SellerContext = createContext()

export const SellerInitialState = {
  progressStatus: 0,
  offeringData: {}
};

// Object.entries(NAME).map((name) => 
//   SellerInitialState.offeringData[name[1]] = null
// )

// payload resolver
export const Seller = {
  toggleProgressStatus: (value) => ({
    type: DIC.TOGGLE_PROGRESS_STATUS,
    payload: value
  }),
  updateOfferingData: (datatObject) => ({
    type: DIC.UPDATE_OFFERING_DATA,
    payload: datatObject
  }),
}

export const SellerReducer = (state, action) => {
  const actionList = {

    [DIC.TOGGLE_PROGRESS_STATUS]: () => ({
      progressStatus: action.payload
    }),
    [DIC.UPDATE_OFFERING_DATA]: () => ({
      offeringData: {
        ...state.offeringData,
        ...action.payload
      }
    }),

  };

  return {...state, ...actionList[action.type]()};
}