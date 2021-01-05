import { createContext } from 'react'
import { DIC } from "../helpers/Dictionary"

export const GlobalContext = createContext()

export const GlobalInitialState = {
  productView: {
    open: 0,
    id: 0
  },
  navigation: {
    state: DIC.NAV.DEF
  },
  qrReaderActivated: 0
};

export const Action = {
  openProduct: newId => ({
    type: DIC.OPEN_PRODUCT,
    payload: newId
  }),

  closeProduct: () => ({
    type: DIC.CLOSE_PRODUCT,
  }),

  navigationControl: (nav) => ({
    type: DIC.NAV.CONTROL,
    payload: nav
  }),

  toggleQRReader: (state) => ({
    type: DIC.ACTIVATE_QR_READER,
    payload: state
  })
}

export const GlobalReducer = (state, action) => {
  const actionList = {
    [DIC.OPEN_PRODUCT]: () => {
      UpdateReviewedProducts(action.payload)
      UpdateProductView(1)

      return {
        productView: {
          open: 1,
          id: action.payload
        }
      }
    },
    [DIC.CLOSE_PRODUCT]: () => {
      UpdateProductView(0)

      return {
        productView: {
          open: 0,
        }
      }
    },
    [DIC.NAV.CONTROL]: () => {
      return {
        navigation: {
          state: action.payload
        }
      }
    },
    [DIC.ACTIVATE_QR_READER]: () => {
      return {
        qrReaderActivated: action.payload
      }
    }
  };

  return {...state, ...actionList[action.type]()};
}

const update = {
  productsReviewed: [],
  productIsOpen: 0
}

const Settings = {
  maxReviewedProducts: 3
}

const UpdateProductView = (status) => {
  localStorage.setItem('productIsOpen', JSON.stringify(status))
}

const UpdateReviewedProducts = (id) => {
  update.productsReviewed = localStorage.getItem('productsReviewed')

  if(update.productsReviewed != null) {
    update.productsReviewed = JSON.parse(update.productsReviewed)
  } else {
    update.productsReviewed = []
  }
  
  if(!update.productsReviewed.length || !update.productsReviewed.includes(id)) {
    if(update.productsReviewed.length < Settings.maxReviewedProducts) {
      update.productsReviewed.push(id)
    } else {
      (update.productsReviewed).shift()
      update.productsReviewed.push(id)
    }
  
  }

  localStorage.setItem('productsReviewed', JSON.stringify(update.productsReviewed))
}