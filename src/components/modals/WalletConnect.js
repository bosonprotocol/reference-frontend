/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useContext, useState } from "react";
import classNames from "classnames";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { usePrevious } from "../../hooks";
import { shortenAddress } from "../../utils";
// import Modal from "../shared/Modal";
import { injected, RINKEBY_ID, walletconnect } from "../../connectors";
import WalletConnectIcon from "../../images/walletconnect.svg";
import MetaMaskLogo from "../../images/metamask.png";
import WalletConnectLogo from "../../images/walletconnect.svg";
import Identicon from "./Identicon";
import CopyHelper from "../../copyHelper";
import './WalletConnect.scss'
import { WalletContext } from "../../contexts/Wallet";
import { LoadingContext, Toggle, wallet, account as loadingAccount } from "../../contexts/Loading";

export const WALLET_VIEWS = {
    OPTIONS: "options",
    OPTIONS_SECONDARY: "options_secondary",
    ACCOUNT: "account",
    PENDING: "pending",
};

export function getWalletTitle({ account, walletView, setWalletView }) {
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
        return <h1 className="account-title">Account</h1>;
    }
    if (account && walletView === WALLET_VIEWS.OPTIONS) {
        return (
            <button
                onClick={ () => setWalletView(WALLET_VIEWS.ACCOUNT) }
                className="button primary"
            >
                Back
            </button>
        );
    }
    if (!account) {
        return <h1 className="account-title">Connect to a wallet</h1>;
    }
}

// export default function ModalWalletConnect({ modal, setModal }) {
//     const context = useWeb3React();
//     const { account } = context;
//     const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
//
//     return (
//         <Modal
//             title={ getWalletTitle({ account, walletView, setWalletView }) }
//             setModal={ setModal }
//             modal={ modal }
//         >
//             <InnerModal isAccount={ account && walletView === WALLET_VIEWS.ACCOUNT }>
//                 <WalletConnect
//                     onSuccess={ () => setModal(null) }
//                     walletView={ walletView }
//                     setWalletView={ setWalletView }
//                 />
//             </InnerModal>
//         </Modal>
//     );
// }

export function WalletConnect({
                                  onSuccess,
                                  setWalletView,
                                  walletView = WALLET_VIEWS.ACCOUNT,
                                  getData
                              }) {
    const isMounted = useRef(false);
    const context = useWeb3React();
    const {
        chainId,
        connector,
        account,
        activate,
        active,
        error,
    } = context;

    const walletContext = useContext(WalletContext);
    const loadingContext = useContext(LoadingContext);
    const connectorsByName = walletContext.walletState.connectorsByName;

    const previousAccount = usePrevious(account);

    // close on connection, when logged out before
    useEffect(() => {
        if (isMounted.current && account && !previousAccount) {
            if (onSuccess) onSuccess();
        }
    }, [account, previousAccount, onSuccess]);

    // close modal when a connection is successful
    const activePrevious = usePrevious(active);
    const connectorPrevious = usePrevious(connector);
    useEffect(() => {
        if (!chainId) return;
        if (
            isMounted.current &&
            ((active && !activePrevious) ||
                (connector && connector !== connectorPrevious && !error))
        ) {
            if (setWalletView) setWalletView(WALLET_VIEWS.ACCOUNT);
        }
    }, [
        setWalletView,
        active,
        error,
        chainId,
        connector,
        activePrevious,
        connectorPrevious,
    ]);

    useEffect(() => {
        isMounted.current = true;
        return () => (isMounted.current = false);
    }, []);

    function onConnectionClicked(name) {
        loadingContext.dispatch(Toggle.Loading(loadingAccount?.button, 1))
        if (name === "WalletConnect") {
            const walletConnectData = localStorage.getItem('walletconnect')

            const walletConnectDataObject = JSON.parse(walletConnectData);
            if (walletConnectDataObject && walletConnectDataObject.chainId !== RINKEBY_ID) {
                // ToDo: Use Global notification
                console.error("Please use Rinkeby network.");
                return
            }
        }

        const current = connectorsByName[name];
        activate(current).then(() => {
            loadingContext.dispatch(Toggle.Loading(loadingAccount?.button, 0))
        });
    }

    return (
        <>
            { account ? <WalletAccount loadingContext={loadingContext}/> : null }
            <div className="wallets">
                <WalletListItem
                    loadingContext={loadingContext}
                    name={ "MetaMask" }
                    imageName={ MetaMaskLogo }
                    isActive={ connector === injected }
                    onClick={ () => {
                        onConnectionClicked("MetaMask")
                    } }
                />
                <WalletListItem
                    loadingContext={loadingContext}
                    name={ "WalletConnect" }
                    imageName={ WalletConnectLogo }
                    isActive={ connector === walletconnect }
                    onClick={ () => {
                        // if the user has already tried to connect, manually reset the connector
                        if (connector?.walletConnectProvider?.wc?.uri) {
                            connector.walletConnectProvider = undefined;
                        }
                        onConnectionClicked("WalletConnect")
                    } }
                />
            </div>
        </>
    );
}

// function InnerModal({ children, isAccount }) {
//     return <div className={ "pa4 " + (isAccount ? "pt0" : "") }>{ children }</div>;
// }

function WalletListItem({
                            name,
                            imageName,
                            onClick,
                            loadingContext,
                            isActive,
                            imageStyle = {},
                        }) {
    return (
        <div
            onClick={ onClick ? onClick : null }
            className={ classNames(
                "wallet-list-item",
                {
                    "hover-b--primary5": !isActive,
                    "active-connector": isActive,
                }
            ) }
        >
            <div className="wallet-list-item-image-holder">
                <img
                    src={ imageName }
                    alt={ name + "-" + imageName }
                    style={ imageStyle }
                />
            </div>
            <div className="list-item-option">
                { name }
            </div>
            <div className="status">
                { isActive ? (
                        <div className="active-wallet-indicator">
                            <img src="images/active-wallet.png"
                                 alt="Active wallet"/> Connected
                        </div>
                    ) :
                    <div className={`button gray ${loadingContext.state[wallet?.network] ? 'is-loading' : ''}`} role="button">
                        CONNECT
                    </div>
                }
            </div>
        </div>
    );
}

function WalletAccount({loadingContext}) {
    const { account, connector } = useWeb3React();
    const [connectedNetowrk, setConnectedNetowrk] = useState()
    const web3 = new Web3(window.ethereum);

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

    const copyButton = <CopyHelper toCopy={ account }>
        <span style={ { marginLeft: "4px" } }>Copy Address</span>
    </CopyHelper>


    useEffect(() => {
        loadingContext.dispatch(Toggle.Loading(wallet?.network, 1))
        web3?.eth?.net?.getNetworkType()?.then(netId => {
            setConnectedNetowrk(netId)
            loadingContext.dispatch(Toggle.Loading(wallet?.network, 0))
        })
    }, [])

    return (
        <>
            <div className="connected-wallet">
                <div className={`address relative ${loadingContext.state[wallet?.network] ? 'is-loading' : ''}`}>
                    <div className="netowrk-info flex center">
                        <span className={`net-name`}>{connectedNetowrk}</span>
                    </div>
                    <div className="url flex ai-center">{ getStatusIcon() }{ shortenAddress(account) }</div>
                    <div className="copy">{ copyButton }</div>
                </div>
                {/* <div className="control flex split">
                    <div className="button gray w50">REMOVE</div>
                    <div className="button gray action w50" role="button"
                    onClick={ () => setWalletView(WALLET_VIEWS.OPTIONS) }>CHANGE</div>
                </div> */ }
            </div>
        </>
    );
}
