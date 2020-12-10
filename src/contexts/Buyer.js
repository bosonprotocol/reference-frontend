import { createContext, useContext } from 'react'

// import { GlobalContext } from "../contexts/Global"
import { DIC } from "./Dictionary"

export const BuyerContext = createContext()

export const BuyerInitialState = {
  productView: 0,
  productViewId: 0,
  buyerStep: null
};

export const Buyer = {
  buyerCOMMITED: () => dispatched.type = DIC.COMMITED
}

const dispatched = {
  type: null,
  payload: null
}

export const BuyerReducer = (state, action) => {
  // const globalContext = useContext(GlobalContext)

  
  dispatched.payload = action



  const actionList = {
    [DIC.COMMITED]: () => {
      localStorage.setItem('buyerStep', DIC.COMMITED)

      return {
        buyerStep: DIC.COMMITED
      }
    },
  };

  return {...state, ...actionList[action]()};
}