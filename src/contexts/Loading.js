import { createContext } from 'react'
import { CONTROL } from "../helpers/Dictionary"
import { getData as getContextData } from "../helpers/Context"

export const getData = getContextData

export const LoadingContext = createContext()

export const LoadingInitalState = {
  wallet: {
    address: 0,
    network: 0,
  }
};

// payload resolver
export const Loading = {
  toggleLoading: (element, toggle) => ({
    type: CONTROL.TOGGLE_LOADING,
    payload: { target: element, state: toggle },
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