import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Layout, { CenterBox } from "./ConnectLayout";
import {
    WalletConnect,
    WALLET_VIEWS,
    getWalletTitle,
    // signMessage,
} from "../components/modals/WalletConnect";

export default function Connect() {
    const [walletView, setWalletView] = useState(WALLET_VIEWS.OPTIONS);
    // const { account, library, chainId } = useWeb3React();
    const { account } = useWeb3React();

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

        // if (!account || !chainId) return;
        // signMessage({ account, library, chainId });
    }, []);

    return (
        <Layout autoPopup={ false } status={ false }>
            <CenterBox>
                <div className="">
                    { getWalletTitle({ account, walletView, setWalletView }) }
                </div>
                <WalletConnect walletView={ walletView } setWalletView={ setWalletView }/>
            </CenterBox>
        </Layout>
    );
}
