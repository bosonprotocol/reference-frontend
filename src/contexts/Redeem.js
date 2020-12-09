import { createContext } from 'react'

export const RedeemContext = createContext()

export const RedeemInitialState = {counter: 0};

export const RedeemReducer = (state, action) => {

  const actionList = {
    'increment': () => {
      return {
        ...state,
        counter: state.counter + 1
      }
    },
    'decrement': () => {
      return {
        ...state,
        counter: state.counter - 1
      }
    },
    'reset': () => {
      return RedeemInitialState
    },
    'default': () => {
      return state;
    }
  };

  return (actionList[action] || actionList['default'])();
}