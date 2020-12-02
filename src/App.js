import "./styles/Global.scss"

import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Onboarding from './views/Onboarding'
import Connect from "./views/Connect";

import { useStore } from "./hooks";
import ModalWalletConnect, {
    MODAL_WALLET_CONNECT,
} from "./components/modals/WalletConnect";

function App() {
    const [newUser, setNewUser] = useState(!localStorage.getItem('onboarding-completed'))
    const [modalControl, setModalControl] = useState("onboarding-modal")

    const completeOnboarding = () => {
        localStorage.setItem('onboarding-completed', '1')
        setModalControl(modalControl + ' fade-out')

        setTimeout(() => {
            setNewUser(false)
        }, 300);
    };

    const [modal, setModal] = useStore(["modal"]);

    return (
        <div className="simulate-mobile">
            { newUser &&
            <div className={ modalControl }>
                <Onboarding completeOnboarding={ completeOnboarding }/>
            </div>
            }
            <Router>
                <Switch>
                    <Route exact strict path="/" component={ Connect }/>
                </Switch>
                { modal && modal.type === MODAL_WALLET_CONNECT ? (
                    <ModalWalletConnect setModal={ setModal } modal={ modal }/>
                ) : null }
            </Router>
        </div>
    );
}

export default App;
