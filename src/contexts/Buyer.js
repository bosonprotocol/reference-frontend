import { createContext } from 'react'
import { DIC } from "./Dictionary"

export const BuyerContext = createContext()

export const BuyerInitialState = {
  buyerStep: 0
};

// payload resolver
export const Buyer = {
  commitToBuy: () => ({
    type: DIC.COMMITED,
  })
}

export const BuyerReducer = (state, action) => {
  const actionList = {
    [DIC.COMMITED]: () => ({
      buyerStep: DIC.COMMITED
    }),
  };

  return {...state, ...actionList[action.type]()};
}