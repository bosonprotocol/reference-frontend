import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
    WalletConnect,
    WALLET_VIEWS,
    getWalletTitle
} from "../components/modals/WalletConnect";
import { useEagerConnect } from "../hooks";
import { NetworkContextName } from "../constants";
import { network } from "../connectors";
// import { shortenAddress } from "../utils";
import { useHistory } from "react-router-dom";

import './Connect.scss';
import { Arrow } from "../components/shared/Icons";

export default function Connect() {
    const [walletView, setWalletView] = useState(WALLET_VIEWS.OPTIONS);
    const history = useHistory();
    const context = useWeb3React();
    const {
        account,
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

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if (id !== null) {
            localStorage.setItem("state", id);
        }
        const callbackURL = urlParams.get("callbackURL");
        if (callbackURL !== null) {
            localStorage.setItem("callbackURL", callbackURL);
        }
        const isRedirect = urlParams.get('redirect');
        if (isRedirect !== null) {
            localStorage.setItem("redirect", isRedirect);
        }
    }, []);

    function goToHomeScreen() {
        history.push("/");
    }

    return (
        <section className="connect">
            <div className="container l flex column jc-sb">
                <div className="bind column">
                    <div className="top-navigation flex ai-center">
                        <div className="button square" role="button" onClick={ goToHomeScreen }>
                            <Arrow/>
                        </div>
                    </div>
                    <div className="content">
                        { getWalletTitle({ account, walletView, setWalletView }) }
                        <WalletConnect walletView={ walletView } setWalletView={ setWalletView }/>
                    </div>
                </div>
            </div>
        </section>
    );
}
