import { createContext } from "react";
import { injected, walletconnect } from "../connectors";
import { getData as getContextData } from "../helpers/Context";

export const getData = getContextData;

export const WalletContext = createContext();

export const WalletInitialState = {
  connectorsByName: {
    MetaMask: injected,
    WalletConnect: walletconnect,
  },
};

export const WalletReducer = (state, action) => {
  const actionList = {
    default: () => {
      return state;
    },
  };

  return (actionList[action] || actionList["default"])();
};
