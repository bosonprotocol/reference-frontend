import "./styles/Global.scss"

import React, { useState, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Onboarding from './views/Onboarding'
import Home from './views/Home'
import Connect from "./views/Connect";

import { useStore } from "./hooks";
import ModalWalletConnect, {
    MODAL_WALLET_CONNECT,
} from "./components/modals/WalletConnect"

function App() {
    const [newUser, setNewUser] = useState(!localStorage.getItem('onboarding-completed'));
    const screensRef = useRef();
    const onboardingModalRef = useRef();

    const modalCloseTimeout = 900;

    const [modal, setModal] = useStore(["modal"]);

    const completeOnboarding = () => {
        localStorage.setItem('onboarding-completed', '1');

        onboardingModalRef.current.classList.add('fade-out');
        screensRef.current.classList.add('onboarding-done');

        setTimeout(() => {
            setNewUser(false)
        }, modalCloseTimeout);
    };

    return (
        <div className="emulate-mobile">
            { newUser &&
            <div className="onboarding-modal flex center" ref={ onboardingModalRef }>
                <Onboarding completeOnboarding={ completeOnboarding }/>
            </div>
            }
            <div className={ `screens ${ newUser ? 'new-user' : '' }` } ref={ screensRef }>
                <Router>
                    <Switch>
                        <Home/>
                        <Route exact strict path="/connect" component={ Connect }/>
                    </Switch>
                    { modal && modal.type === MODAL_WALLET_CONNECT ? (
                        <ModalWalletConnect setModal={ setModal } modal={ modal }/>
                    ) : null }
                </Router>
            </div>
        </div>
    );
}

export default App;
