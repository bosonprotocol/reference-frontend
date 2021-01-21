import "./styles/Theme.scss"
import "./styles/Global.scss"

import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './views/Home'
import Connect from "./views/Connect";
import ShowQR from "./views/ShowQR"
import NewOffer from "./views/NewOffer"
import Activity from "./views/Activity"
import VoucherDetails from "./views/VoucherDetails"

import TopNavigation from "./components/shared/navigation/TopNavigation"
import BottomNavigation from "./components/shared/navigation/BottomNavigation"
import LocationManager from "./components/shared/navigation/LocationManager"

import { useEagerConnect, useInactiveListener } from './hooks'

import "./styles/Animations.scss"

import OnboardingReset from "./views/OnboardingReset"
import ConnectToMetamask from "./views/ConnectToMetamask"

import { WalletContext, WalletInitialState, WalletReducer } from "./contexts/Wallet"
import { BuyerContext, BuyerInitialState, BuyerReducer } from "./contexts/Buyer"
import { SellerContext, SellerInitialState, SellerReducer } from "./contexts/Seller"
import { GlobalContext, GlobalInitialState, GlobalReducer } from "./contexts/Global"
import { ModalContext, ModalInitialState, ModalReducer } from "./contexts/Modal";
import { NavigationContext, NavigationInitialState, NavigationReducer } from "./contexts/Navigation";

import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "./constants";
import { network } from "./connectors";

import { ROUTE } from "./helpers/Dictionary"
import ContextModal from "./components/shared/ContextModal";
import ActivityVouchers from "./views/ActivityVouchers";

function App() {
    const [walletState] = useReducer(WalletReducer, WalletInitialState);
    const [buyerState, buyerDispatch] = useReducer(BuyerReducer, BuyerInitialState);
    const [sellerState, sellerDispatch] = useReducer(SellerReducer, SellerInitialState);
    const [globalState, globalDispatch] = useReducer(GlobalReducer, GlobalInitialState);
    const [modalState, modalDispatch] = useReducer(ModalReducer, ModalInitialState);
    const [navigationState, navigationDispatch] = useReducer(NavigationReducer, NavigationInitialState);

    const redeemContextValue = {
      state: buyerState,
      dispatch: buyerDispatch
    }

    const sellerContextValue = {
      state: sellerState,
      dispatch: sellerDispatch
    }

    const modalContextValue = {
        state: modalState,
        dispatch: modalDispatch
    }

    const globalContextValue = {
        state: globalState,
        dispatch: globalDispatch
    }

    const walletContextValue = {
        walletState: walletState
    }

    const navigationContextValue = {
        state: navigationState,
        dispatch: navigationDispatch
      }

    const context = useWeb3React();
    const {
        active,
    } = context;

    const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

    const triedEager = useEagerConnect();
    // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
    useEffect(() => {
        if (triedEager && !networkActive && !networkError && !active) {
            activateNetwork(network)
        }
    }, [triedEager, networkActive, networkError, activateNetwork, active]);

    useInactiveListener(true)

    return (
    // dark|light; (default: dark)
    <div className="emulate-mobile theme">
        <ModalContext.Provider value={modalContextValue}>
        <GlobalContext.Provider value={globalContextValue}>
        <BuyerContext.Provider value={redeemContextValue}>
        <SellerContext.Provider value={sellerContextValue}>
        <WalletContext.Provider value={walletContextValue}>
        <NavigationContext.Provider value={navigationContextValue}>
            <Router>
                <LocationManager />
                <TopNavigation />
                <Switch>
                <Route exact strict path={ROUTE.Connect} component={Connect}/>
                <Route exact path={ROUTE.Home} component={Home}/>
                <Route path="/onboarding" component={OnboardingReset}/> {/* delete on prod */}
                <Route path={ROUTE.ConnectToMetamask} component={ConnectToMetamask}/>
                <Route path={ROUTE.ShowQR} component={ShowQR}/>
                <Route path={ROUTE.NewOffer} component={NewOffer}/>
                <Route path={ROUTE.Activity} component={Activity}/>
                <Route path={ROUTE.ActivityVouchers} component={ActivityVouchers}/>
                <Route path={ROUTE.VoucherDetails + ROUTE.PARAMS.ID} component={VoucherDetails}/>
                </Switch>
                <BottomNavigation />
            </Router>
            <ContextModal/>
        </NavigationContext.Provider>
        </WalletContext.Provider>
        </SellerContext.Provider>
        </BuyerContext.Provider>
        </GlobalContext.Provider>
        </ModalContext.Provider>
    </div>
    );
}

export default App;
