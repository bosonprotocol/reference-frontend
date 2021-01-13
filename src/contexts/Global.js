import { createContext } from 'react'
import { DIC } from "../helpers/Dictionary"
// import { disableScroll, enableScroll } from "../helpers/ScrollManipulation"

export const GlobalContext = createContext()

export const GlobalInitialState = {
    productView: {
        open: 0,
        id: 0
    },
    navigation: {
        state: DIC.NAV.DEF
    },
    qrReaderActivated: 0,
    allVoucherSets: []
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
    }),

    allVoucherSets: (state) => ({
        type: DIC.ALL_VOUCHER_SETS,
        payload: state
    })
}

export const GlobalReducer = (state, action) => {
    const actionList = {
        [DIC.OPEN_PRODUCT]: () => {
            UpdateReviewedProducts(action.payload)
            UpdateProductView(1)
            // disableScroll(document.body)

            return {
                productView: {
                    open: 1,
                    id: action.payload
                }
            }
        },
        [DIC.CLOSE_PRODUCT]: () => {
            UpdateProductView(0)
            // enableScroll(document.body)

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
        },
        [DIC.ALL_VOUCHER_SETS]: () => {
            return {
                allVoucherSets: action.payload
            }
        }
    };

    return { ...state, ...actionList[action.type]() };
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
    // get from local storage
    update.productsReviewed = localStorage.getItem('productsReviewed')

    // check if it has been assigned
    if (update.productsReviewed != null) {
        update.productsReviewed = JSON.parse(update.productsReviewed)
    } else {
        // if not, create new array
        update.productsReviewed = []
    }

    if (update.productsReviewed[update.productsReviewed.length - 1] !== id) {
        if (update.productsReviewed.length < Settings.maxReviewedProducts) {
            update.productsReviewed.push(id)
        } else {
            (update.productsReviewed).shift()
            update.productsReviewed.push(id)
        }

    }

    localStorage.setItem('productsReviewed', JSON.stringify(update.productsReviewed))
}
