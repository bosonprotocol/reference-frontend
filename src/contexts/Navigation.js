import { createContext } from 'react'
import { CONTROL, AFFMAP } from "../helpers/Dictionary"
import { getData as getContextData } from "../helpers/Context"

export const MAP = CONTROL

export const getData = getContextData

export const NavigationContext = createContext()

export const NavigationInitialState = {
  location: null,
  top: {
    [AFFMAP.WALLET_CONNECTION]: false,
    [AFFMAP.BACK_BUTTON]: false,
    [AFFMAP.QR_CODE_READER]: false,
  },
};

export const Action = {
  updateLocation: (location) => ({
    type: CONTROL.UPDATE_LOCATION,
    payload: location
  }),
  updateAffordances: (location) => ({
    type: CONTROL.UPDATE_AFFORDANCES,
    payload: location
  }),
}

export const NavigationReducer = (state, action) => {
  const actionList = {
    [CONTROL.UPDATE_LOCATION]: () => {
      return {
        location: action.payload
      }
    },
    [CONTROL.UPDATE_AFFORDANCES]: () => {
      return {
        top: action.payload
      }
    },
  }

  return { ...state, ...actionList[action.type]() }
}


