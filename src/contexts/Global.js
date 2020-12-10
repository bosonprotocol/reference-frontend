import { createContext } from 'react'

export const GlobalContext = createContext()

export const GlobalInitialState = {
  productView: {
    open: 0,
    id: 0
  }
};

export const Action = {
  openProduct: newId => ({
    productView: {
      open: 1,
      id: newId
    }
  }),
  
  closeProduct: () => ({
    productView: {
      open: 0,
    }
  }),
}

export const GlobalReducer = (state, action) => ({...state, ...action})
