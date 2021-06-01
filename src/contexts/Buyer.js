import { createContext } from "react";
import { DIC } from "../helpers/configs/Dictionary";
import { getData as getContextData } from "../helpers/ContextHelper";

export const getData = getContextData;

export const BuyerContext = createContext();

export const BuyerInitialState = {
  buyerStep: 0,
};

export const BuyerReducer = (state, action) => {
  const actionList = {
    [DIC.COMMITED]: () => ({
      buyerStep: DIC.COMMITED,
    }),
    [DIC.CONNECTED]: () => ({
      buyerStep: DIC.CONNECTED,
    }),
  };

  return { ...state, ...actionList[action.type]() };
};
