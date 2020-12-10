import "./styles/Global.scss"

import React, { useReducer } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './views/Home'
import Connect from "./views/Connect";

import "./styles/Animations.scss"

import OnboardingReset from "./views/OnboardingReset"
import ConnectToMetamask from "./views/ConnectToMetamask"

import { WalletContext, WalletInitialState, WalletReducer } from "./contexts/Wallet"
import { RedeemContext, RedeemInitialState, RedeemReducer } from "./contexts/Redeem"
import { GlobalContext, GlobalInitialState, GlobalReducer } from "./contexts/Global"

function App() {
    const [walletState] = useReducer(WalletReducer, WalletInitialState);
    const [redeemState, redeemDispatch] = useReducer(RedeemReducer, RedeemInitialState);
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
        <RedeemContext.Provider value={redeemContextValue}>
        <GlobalContext.Provider value={globalContextValue}>
        <WalletContext.Provider value={walletContextValue}>
          <Router>
            <Switch>
                <Route exact strict path="/connect" component={ Connect }/>
                <Route exact path="/" component={Home}/>
                <Route path="/onboarding" component={OnboardingReset}/> {/* delete on prod */}
                <Route path="/metamask" component={ConnectToMetamask}/>
            </Switch>
          </Router>
        </WalletContext.Provider>
        </GlobalContext.Provider>
        </RedeemContext.Provider>
      </div>
    );
}

export default App;
