import { createContext } from 'react'
import { DIC } from "./Dictionary"

export const GlobalContext = createContext()

export const GlobalInitialState = {
  productView: {
    open: 0,
    id: 0
  }
};

export const Action = {
  openProduct: newId => ({
    type: DIC.OPEN_PRODUCT,
    payload: newId
  }),

  closeProduct: () => ({
    type: DIC.CLOSE_PRODUCT,
  }),
}

const update = {
  productsReviewed: [],
  productIsOpen: 0
}

const Constant = {
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
    if(update.productsReviewed.length < Constant.maxReviewedProducts) {
      update.productsReviewed.push(id)
    } else {
      (update.productsReviewed).shift()
      update.productsReviewed.push(id)
    }
  
  }

  localStorage.setItem('productsReviewed', JSON.stringify(update.productsReviewed))
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
  };

  return {...state, ...actionList[action.type]()};
}