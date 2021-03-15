import { createContext } from 'react'
import { CONTROL } from "../helpers/Dictionary"
import { getData as getContextData } from "../helpers/Context"

export const getData = getContextData

export const LoadingContext = createContext()

export const wallet = {
  address: 'wallet-address',
  network: 'wallet-network',
}

export const newOffer = {
  categories: 'newOffer-categories',
}

export const activity = {
  block: 'activity-block',
}

export const LoadingInitialState = {
  [wallet.address]: 0,
  [wallet.network]: 0,
  [newOffer.categories]: 0,
  [activity.block]: 0,
};

// payload resolver
export const Toggle = {
  Loading: (element, toggle) => ({
    type: CONTROL.TOGGLE_LOADING,
    payload: { target: element.split('.'), state: toggle },
  }),
}

export const LoadingReducer = (state, action) => {
  const actionList = {

    [CONTROL.TOGGLE_LOADING]: () => ({
      [action.payload.target]: action.payload.state
    }),
  };

  return {...state, ...actionList[action.type]()};
}

// loadingContext.dispatch(Toggle.Loading(el.wallet.network, 1))