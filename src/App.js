import "./styles/Theme.scss";
import "./styles/Global.scss";

import React, { useEffect, useReducer } from "react";

import { useEagerConnect, useInactiveListener } from "./hooks";

import "./styles/Animations.scss";

import Routes from "./Routes";

import {
  WalletContext,
  WalletInitialState,
  WalletReducer,
} from "./contexts/Wallet";
import {
  BuyerContext,
  BuyerInitialState,
  BuyerReducer,
} from "./contexts/Buyer";
import {
  SellerContext,
  SellerInitialState,
  SellerReducer,
} from "./contexts/Seller";
import {
  GlobalContext,
  GlobalInitialState,
  GlobalReducer,
} from "./contexts/Global";
import {
  ModalContext,
  ModalInitialState,
  ModalReducer,
} from "./contexts/Modal";
import {
  NavigationContext,
  NavigationInitialState,
  NavigationReducer,
} from "./contexts/Navigation";
import {
  LoadingContext,
  LoadingInitialState,
  LoadingReducer,
} from "./contexts/Loading";

import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "./constants";
import { network } from "./connectors";

import ContextModal from "./components/shared/ContextModal";
import {
  authenticateUser,
  getAccountStoredInLocalStorage,
} from "./hooks/authenticate";
import { isTokenValid } from "./utils/auth";

function App() {
  const [walletState] = useReducer(WalletReducer, WalletInitialState);
  const [buyerState, buyerDispatch] = useReducer(
    BuyerReducer,
    BuyerInitialState
  );
  const [sellerState, sellerDispatch] = useReducer(
    SellerReducer,
    SellerInitialState
  );
  const [globalState, globalDispatch] = useReducer(
    GlobalReducer,
    GlobalInitialState
  );
  const [modalState, modalDispatch] = useReducer(
    ModalReducer,
    ModalInitialState
  );
  const [navigationState, navigationDispatch] = useReducer(
    NavigationReducer,
    NavigationInitialState
  );
  const [loadingState, loadingDispatch] = useReducer(
    LoadingReducer,
    LoadingInitialState
  );

  const redeemContextValue = {
    state: buyerState,
    dispatch: buyerDispatch,
  };

  const sellerContextValue = {
    state: sellerState,
    dispatch: sellerDispatch,
  };

  const modalContextValue = {
    state: modalState,
    dispatch: modalDispatch,
  };

  const globalContextValue = {
    state: globalState,
    dispatch: globalDispatch,
  };

  const walletContextValue = {
    walletState: walletState,
  };

  const navigationContextValue = {
    state: navigationState,
    dispatch: navigationDispatch,
  };

  const loadingContextValue = {
    state: loadingState,
    dispatch: loadingDispatch,
  };

  const context = useWeb3React();
  const { active, account, library, chainId } = context;
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React(NetworkContextName);

  const triedEager = useEagerConnect();
  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  useInactiveListener(true);

  useEffect(() => {
    if (!account) {
      return;
    }

    const localStoredAccountData = getAccountStoredInLocalStorage(account);
    const onboardingCompleted = localStorage.getItem("onboarding-completed");

    if (localStoredAccountData) {
      localStoredAccountData.activeToken = isTokenValid(
        localStoredAccountData.authToken
      );
    }

    if (!!!+onboardingCompleted || localStoredAccountData.activeToken) {
      return;
    }

    authenticateUser(library, account, chainId);
  }, [account, library, chainId]);

  useEffect(() => {
    const localstorage_v = process.env.REACT_APP_FRONT_END_LOCALSTORAGE_VERSION;

    if (localStorage["localstorage_v"] !== localstorage_v) {
      const onboarding_completed = localStorage["onboarding-completed"];

      localStorage.clear();
      localStorage["localstorage_v"] = localstorage_v;
      localStorage["onboarding-completed"] =
        onboarding_completed === undefined ? 0 : onboarding_completed;
    }
  }, []);

  return (
    <ModalContext.Provider value={modalContextValue}>
      <GlobalContext.Provider value={globalContextValue}>
        <BuyerContext.Provider value={redeemContextValue}>
          <SellerContext.Provider value={sellerContextValue}>
            <WalletContext.Provider value={walletContextValue}>
              <NavigationContext.Provider value={navigationContextValue}>
                <LoadingContext.Provider value={loadingContextValue}>
                  <Routes />
                  <ContextModal />
                </LoadingContext.Provider>
              </NavigationContext.Provider>
            </WalletContext.Provider>
          </SellerContext.Provider>
        </BuyerContext.Provider>
      </GlobalContext.Provider>
    </ModalContext.Provider>
  );
}

export default App;
