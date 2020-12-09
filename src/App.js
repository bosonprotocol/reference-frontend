import "./styles/Global.scss"

import React, { useReducer } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from './views/Home'
import Connect from "./views/Connect";

import { useStore } from "./hooks";
import ModalWalletConnect, {
    MODAL_WALLET_CONNECT,
} from "./components/modals/WalletConnect"
import QRCodeScanner from "./components/QRCodeScanner";
  
import "./styles/Animations.scss"

import OnboardingReset from "./views/OnboardingReset"
import ConnectToMetamask from "./views/ConnectToMetamask"

import { RedeemContext, RedeemInitialState, RedeemReducer } from "./contexts/Redeem"

function App() {
    const [modal, setModal] = useStore(["modal"]);
    const [qrReaderActivated] = useStore(["qrReaderActivated"]);

    const [redeemState, redeemDispatch] = useReducer(RedeemReducer, RedeemInitialState);

    return (
      <div className="emulate-mobile">
        <RedeemContext.Provider value={{
          redeemState: redeemState,
          redeemDispatch: redeemDispatch
        }}>
          <Router>
            <Switch>
                { qrReaderActivated ? (<QRCodeScanner/>) : null }
                <Route exact strict path="/connect" component={ Connect }/>
                <Route exact path="/" component={Home}/>
                <Route path="/onboarding" component={OnboardingReset}/> {/* delete on prod */}
                <Route path="/metamask" component={ConnectToMetamask}/>
            </Switch>
            { modal && modal.type === MODAL_WALLET_CONNECT ? (
                <ModalWalletConnect setModal={ setModal } modal={ modal }/>
            ) : null }
          </Router>
        </RedeemContext.Provider>
      </div>
    );
}

export default App;
