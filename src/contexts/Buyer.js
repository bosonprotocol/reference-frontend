import { createContext } from 'react'
import { DIC } from "../helpers/Dictionary"
import { getData as getContextData } from "../helpers/Context"

export const getData = getContextData

export const BuyerContext = createContext()

export const BuyerInitialState = {
  buyerStep: 0
};

// payload resolver
export const Buyer = {
  commitToBuy: () => ({
    type: DIC.COMMITED,
  }),
  connectToMetamask: () => ({
    type: DIC.CONNECTED,
  })
}

export const BuyerReducer = (state, action) => {
  const actionList = {

    [DIC.COMMITED]: () => ({
      buyerStep: DIC.COMMITED
    }),
    [DIC.CONNECTED]: () => ({
      buyerStep: DIC.CONNECTED
    }),

  };

  return {...state, ...actionList[action.type]()};
}