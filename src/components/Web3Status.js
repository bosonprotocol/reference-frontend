import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useStore } from "../hooks";
import { shortenAddress } from "../utils";
import { MODAL_WALLET_CONNECT } from "./modals/WalletConnect";
import { injected, walletconnect, walletlink } from "../connectors";
import WalletConnectIcon from "../images/walletconnect.svg";
import Identicon from "./Identicon";

export default function Web3Status() {
    const [, setModal] = useStore(["modal"]);
    const { account, connector, error } = useWeb3React();

    function onOpenWalletConnectModal() {
        setModal({ type: MODAL_WALLET_CONNECT });
    }

    function getStatusIcon() {
        if (connector === injected) {
            return <Identicon/>;
        } else if (connector === walletconnect) {
            return (
                <div className="">
                    <img src={ WalletConnectIcon } alt={ "walletconnect logo" }/>
                </div>
            );
        }
    }

    if (account) {
        return (
            <div
                onClick={ onOpenWalletConnectModal }
                className="r"
            >
                <span className="">{ shortenAddress(account) }</span>
                { getStatusIcon() }
            </div>
        );
    } else if (error) {
        return <div className="">Error</div>;
    } else {
        return (
            <button onClick={ onOpenWalletConnectModal } className="button">
                Connect
            </button>
        );
    }
}
