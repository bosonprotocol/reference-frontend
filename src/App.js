import "./styles/Global.scss"

import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './views/Home'
import Connect from "./views/Connect";
import ShowQR from "./views/ShowQR"

import { useEagerConnect, useInactiveListener } from './hooks'


import "./styles/Animations.scss"

import OnboardingReset from "./views/OnboardingReset"
import ConnectToMetamask from "./views/ConnectToMetamask"

import { WalletContext, WalletInitialState, WalletReducer } from "./contexts/Wallet"
import { BuyerContext, BuyerInitialState, BuyerReducer } from "./contexts/Buyer"
import { GlobalContext, GlobalInitialState, GlobalReducer } from "./contexts/Global"
import TestApi from "./views/TestApi";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "./constants";
import { network } from "./connectors";

function App() {
    const [walletState] = useReducer(WalletReducer, WalletInitialState);
    const [redeemState, redeemDispatch] = useReducer(BuyerReducer, BuyerInitialState);
    const [globalState, globalDispatch] = useReducer(GlobalReducer, GlobalInitialState);

    const redeemContextValue = {
        state: redeemState,
        dispatch: redeemDispatch
    }

    const globalContextValue = {
        state: globalState,
        dispatch: globalDispatch
    }

    const walletContextValue = {
        walletState: walletState
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
        <div className="emulate-mobile">
            <GlobalContext.Provider value={ globalContextValue }>
                <BuyerContext.Provider value={ redeemContextValue }>
                    <WalletContext.Provider value={ walletContextValue }>
                        <Router>
                            <Switch>
                                <Route exact strict path="/connect" component={ Connect }/>
                                <Route exact path="/" component={ Home }/>
                                <Route path="/onboarding" component={ OnboardingReset }/> {/* delete on prod */ }
                                <Route path="/connect-to-metamask" component={ ConnectToMetamask }/>
                                <Route path="/show-qr-code" component={ ShowQR }/>
                            </Switch>
                        </Router>
                    </WalletContext.Provider>
                </BuyerContext.Provider>
            </GlobalContext.Provider>
        </div>
    );
}

export default App;
