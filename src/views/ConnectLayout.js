import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3Status from "../components/Web3Status";
import { useStore, useLocalStorage } from "../hooks";
import { MODAL_WALLET_CONNECT } from "../components/modals/WalletConnect";

export default function Layout({ children, autoPopup = true, status = true }) {
    const { account } = useWeb3React();
    const [, setModal] = useStore(["modal"]);

    // Auto-display wallet modal if coming from bot
    useEffect(() => {
        if (autoPopup && !account) {
            setModal({ type: MODAL_WALLET_CONNECT });
            return;
        }
    }, [autoPopup, account]);

    return (
        <div className="home-bg-image">
            <div className="db flex center justify-between items-center pa3 pa4-l mw7 mw8-l">
                { status ? <Web3Status/> : null }
            </div>
            { children }
        </div>
    );
}

export function CenterBox({ children }) {
    return (
        <div className="db flex center justify-between items-center mv5 pa3 pa4-l mw6 mw7-ns">
            <div className="center w-100 w-60-ns pa3 pa4-ns bg-white br4 shadow-4">
                { children }
            </div>
        </div>
    );
}
