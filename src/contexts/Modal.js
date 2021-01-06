import { createContext } from 'react';
import { DIC } from "../helpers/Dictionary";

export const ModalContext = createContext();

export const ModalInitialState = {
    showModal: false,
    type: null,
    content: null
};

// payload resolver
export const ModalResolver = {
    showModal: (value) => ({
        type: DIC.SHOW_MODAL,
        payload: value
    })
};


export const ModalReducer = (state, action) => {

    const actionList = {
        [DIC.SHOW_MODAL]: () => {
            return {
                showModal: action.payload
            }
        },
    };

    return { ...state, ...actionList[action.type]() };
};
