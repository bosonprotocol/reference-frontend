import { createContext } from 'react'
import { DIC } from "../helpers/Dictionary"

export const SellerContext = createContext()

export const SellerInitialState = {
  progressStatus: 0
};

// payload resolver
export const Seller = {
  toggleProgressStatus: (value) => ({
    type: DIC.TOGGLE_PROGRESS_STATUS,
    payload: value
  }),
}

export const SellerReducer = (state, action) => {
  const actionList = {

    [DIC.TOGGLE_PROGRESS_STATUS]: () => ({
      progressStatus: action.payload
    }),

  };

  return {...state, ...actionList[action.type]()};
}