import "./styles/Global.scss"

import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './views/Home'
import Connect from "./views/Connect";
import ShowQR from "./views/ShowQR"
import NewOffer from "./views/NewOffer"

import { useEagerConnect, useInactiveListener } from './hooks'


import "./styles/Animations.scss"

import OnboardingReset from "./views/OnboardingReset"
import ConnectToMetamask from "./views/ConnectToMetamask"

import { WalletContext, WalletInitialState, WalletReducer } from "./contexts/Wallet"
import { BuyerContext, BuyerInitialState, BuyerReducer } from "./contexts/Buyer"
import { SellerContext, SellerInitialState, SellerReducer } from "./contexts/Seller"
import { GlobalContext, GlobalInitialState, GlobalReducer } from "./contexts/Global"
import TestApi from "./views/TestApi";
import { useWeb3React } from "@web3-react/core";
import { NetworkContextName } from "./constants";
import { network } from "./connectors";


import { ROUTE } from "./helpers/Dictionary"

function App() {
    const [walletState] = useReducer(WalletReducer, WalletInitialState);
    const [buyerState, buyerDispatch] = useReducer(BuyerReducer, BuyerInitialState);
    const [sellerState, sellerDispatch] = useReducer(SellerReducer, SellerInitialState);
    const [globalState, globalDispatch] = useReducer(GlobalReducer, GlobalInitialState);

    const redeemContextValue = {
      state: buyerState,
      dispatch: buyerDispatch
    }

    const sellerContextValue = {
      state: sellerState,
      dispatch: sellerDispatch
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
<<<<<<< HEAD
      <div className="emulate-mobile">
        <GlobalContext.Provider value={globalContextValue}>
        <BuyerContext.Provider value={redeemContextValue}>
        <SellerContext.Provider value={sellerContextValue}>
        <WalletContext.Provider value={walletContextValue}>
          <Router>
            <Switch>
                <Route exact strict path={ROUTE.Connect} component={Connect}/>
                <Route exact path={ROUTE.Home} component={Home}/>
                <Route path="/onboarding" component={OnboardingReset}/> {/* delete on prod */}
                <Route path={ROUTE.ConnectToMetamask} component={ConnectToMetamask}/>
                <Route path={ROUTE.ShowQR} component={ShowQR}/>
                <Route path={ROUTE.NewOffer} component={NewOffer}/>
            </Switch>
          </Router>
        </WalletContext.Provider>
        </SellerContext.Provider>
        </BuyerContext.Provider>
        </GlobalContext.Provider>
      </div>
=======
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
>>>>>>> d9bb37752c8794ad16a84396dd2d75910d54a385
    );
}

export default App;
