import { createContext } from 'react'
import { CONTROL } from "../helpers/Dictionary"
import { getData as getContextData } from "../helpers/Context"

export const getData = getContextData

export const LoadingContext = createContext()

export const account = {
  button: 'account-button'
}

export const LoadingInitialState = {
  [account.button] : 1,
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