import { createContext } from 'react'

export const GlobalContext = createContext()

export const GlobalInitialState = {
  productView: 0,
  productViewId: 0
};

export const Action = {
  openProduct: id => ({
    productView: 1,
    productViewId: id
  }),
  
  closeProduct: () => ({
    productView: 0
  }),
}

export const GlobalReducer = (state, action) => ({...state, ...action})
