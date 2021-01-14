import { createContext } from 'react'
import { CONTROL } from "../helpers/Dictionary"

export const NavigationContext = createContext()

export const NavigationInitialState = {
  top: {
    qrReader: false,
    connectedWallet: false,
    connectToWallet: false,
    notification: false,
    offerProgress: false,
    pageBack: {
      type: null
    }
  },
  bottom: {
    home: false,
    buy: false,
    add: false,
    sell: false,
    wallet: false,
  }
};

export const Top = {
  test: (state) => ({
    type: CONTROL.TEST,
    payload: state
  })
}

export const Bottom = {
  test: (state) => ({
    type: CONTROL.TEST,
    payload: state
  })
}

export const NavigationReducer = (state, action) => {
  const actionList = {
    [CONTROL.TEST]: () => {
      return {
        navigation: {
          state: action.payload
        }
      }
    },
  }

  return { ...state, ...actionList[action.type]() }
}


