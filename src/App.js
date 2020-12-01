import "./styles/Global.scss"

import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Onboarding from './views/Onboarding'
import Connect from "./views/Connect";

import { useStore } from "./hooks";
import ModalWalletConnect, {
    MODAL_WALLET_CONNECT,
} from "./components/modals/WalletConnect";

function App() {
    const [modal, setModal] = useStore(["modal"]);


    return (
        // <div className="simulate-mobile">
        <div>
            {/*<div className="onboarding-modal">*/ }
            {/*    <Onboarding/>*/ }
            {/*</div>*/ }
            <Router>
                <Switch>
                    <Route exact strict path="/connect" component={ Connect }/>
                </Switch>
                { modal && modal.type === MODAL_WALLET_CONNECT ? (
                    <ModalWalletConnect setModal={ setModal } modal={ modal }/>
                ) : null }
            </Router>
        </div>
    );
}

export default App;
