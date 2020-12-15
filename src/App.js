import "./styles/Global.scss"

import React, { useReducer } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './views/Home'
import Connect from "./views/Connect";
import ShowQR from "./views/ShowQR"
import NewOffer from "./views/NewOffer"

import "./styles/Animations.scss"

import OnboardingReset from "./views/OnboardingReset"
import ConnectToMetamask from "./views/ConnectToMetamask"

import { WalletContext, WalletInitialState, WalletReducer } from "./contexts/Wallet"
import { BuyerContext, BuyerInitialState, BuyerReducer } from "./contexts/Buyer"
import { GlobalContext, GlobalInitialState, GlobalReducer } from "./contexts/Global"


import { ROUTE } from "./helpers/Dictionary"

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

    return (
      <div className="emulate-mobile">
        <GlobalContext.Provider value={globalContextValue}>
        <BuyerContext.Provider value={redeemContextValue}>
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
        </BuyerContext.Provider>
        </GlobalContext.Provider>
      </div>
    );
}

export default App;
