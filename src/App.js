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

function App() {
    const [walletState] = useReducer(WalletReducer, WalletInitialState);
    const [redeemState, redeemDispatch] = useReducer(RedeemReducer, RedeemInitialState);

    return (
        <div className="emulate-mobile">
            <WalletContext.Provider value={ {
                walletState: walletState
            } }>
                <RedeemContext.Provider value={ {
                    redeemState: redeemState,
                    redeemDispatch: redeemDispatch
                } }>
                    <Router>
                        <Switch>
                            <Route exact strict path="/connect" component={ Connect }/>
                            <Route exact path="/" component={ Home }/>
                            <Route path="/onboarding" component={ OnboardingReset }/> {/* delete on prod */ }
                            <Route path="/metamask" component={ ConnectToMetamask }/>
                        </Switch>
                    </Router>
                </RedeemContext.Provider>
            </WalletContext.Provider>
        </div>
    );
}

export default App;
