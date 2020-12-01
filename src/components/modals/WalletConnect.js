import React, { useEffect, useState, useRef } from "react";
import Web3 from "web3";
import classNames from "classnames";
import { useWeb3React } from "@web3-react/core";
import { useStore, usePrevious } from "../../hooks";
import { shortenAddress } from "../../utils";
import Modal from "../Modal";
import { injected, walletconnect, walletlink } from "../../connectors";
import WalletConnectIcon from "../../images/walletconnect.svg";
import MetaMaskLogo from "../../images/metamask.png";
import Identicon from "../Identicon";
import CopyHelper from "../../copyHelper";

export const MODAL_WALLET_CONNECT = "modal_wallet_connect";

export const WALLET_VIEWS = {
    OPTIONS: "options",
    OPTIONS_SECONDARY: "options_secondary",
    ACCOUNT: "account",
    PENDING: "pending",
};

export function getWalletTitle({ account, walletView, setWalletView }) {
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
        return <h1 className="f5 ma0">Account</h1>;
    }
    if (account && walletView === WALLET_VIEWS.OPTIONS) {
        return (
            <button
                onClick={ () => setWalletView(WALLET_VIEWS.ACCOUNT) }
                className="outline-0 primary5 fw5"
            >
                Back
            </button>
        );
    }
    if (!account) {
        return <h1 className="f5 ma0">Connect to a wallet</h1>;
    }
}

export default function ModalWalletConnect({ modal, setModal }) {
    const context = useWeb3React();
    const { account } = context;
    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

    return (
        <Modal
            title={ getWalletTitle({ account, walletView, setWalletView }) }
            setModal={ setModal }
            modal={ modal }
        >
            <InnerModal isAccount={ account && walletView === WALLET_VIEWS.ACCOUNT }>
                <WalletConnect
                    onSuccess={ () => setModal(null) }
                    walletView={ walletView }
                    setWalletView={ setWalletView }
                />
            </InnerModal>
        </Modal>
    );
}

// export async function signMessage({ library, account, chainId }, connector) {
//     const skipSignatureVerification = true;
//     // let isSigningRequired = true;
//
//     const web3 = new Web3(library.provider);
//     const urlParams = new URLSearchParams(window.location.search);
//     const id = urlParams.get("id");
//     const callbackURL = urlParams.get("callbackURL");
//     const isNotRedirect =
//         urlParams.get("redirect") === "false" || !urlParams.get("redirect");
//     const fetch = require("node-fetch");
//     // if (connector.walletLink) {
//     // if false that means request is from node-red
//     if (isNotRedirect || connector.walletLink) {
//         const result = {
//             account,
//         };
//         processResponse(undefined, result, "all");
//         return;
//     }
//
//     const msgParams = JSON.stringify(
//         formatEIP712Data(
//             {
//                 from: account,
//                 id,
//                 callbackURL: "",
//             },
//             chainId
//         )
//     );
//     const params = [account, msgParams];
//     const method = "eth_signTypedData_v4";
//     web3.currentProvider.sendAsync(
//         {
//             method,
//             params,
//             account,
//         },
//         async (err, result) => {
//             processResponse(err, result);
//         }
//     );
//
//     async function processResponse(err, result, authType) {
//         const reqType = urlParams.get("req_type");
//         if (reqType === 'kchannel_connect' || reqType === 'kchannel_send') {
//             return;
//         }
//         if (err) {
//             return console.dir(err);
//         }
//         if (result.error) {
//             alert(result.error.message);
//         }
//         if (result.error) return console.error("ERROR", result);
//         if (!isNotRedirect && callbackURL) {
//             window.location.href =
//                 callbackURL +
//                 window.location.search +
//                 `&signature=${ result.result }&account=${ account }`;
//         }
//         // callback wallet connect only if mode is tpc or airdrop
//         if (isNotRedirect && callbackURL) {
//             const data = {
//                 id,
//                 signature: result.result,
//                 account: account,
//                 authType,
//             };
//             try {
//                 const response = await fetch(callbackURL, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(data),
//                 });
//                 const responseData = await response.json();
//                 // console.log("response", responseData);
//                 if (responseData.status)
//                     alert(responseData.status);
//             } catch (error) {
//                 alert(error);
//             }
//         }
//     }
// }

export function WalletConnect({
                                  onSuccess,
                                  setWalletView,
                                  walletView = WALLET_VIEWS.ACCOUNT,
                              }) {
    const isMounted = useRef(false);
    const context = useWeb3React();
    const {
        chainId,
        connector,
        library,
        account,
        activate,
        active,
        error,
    } = context;
    const [connectorsByName] = useStore(["connectorsByName"]);

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
            // if (window.location.search)
            //     signMessage({ account, chainId, library }, connector);
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
        const current = connectorsByName[name];
        activate(current);
    }

    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
        return <WalletAccount setWalletView={ setWalletView }/>;
    }
    return (
        <>
            <WalletListItem
                name={ "MetaMask" }
                imageName={ "metamask.png" }
                isActive={ connector === injected }
                onClick={ () => onConnectionClicked("MetaMask") }
            />
            <WalletListItem
                name={ "WalletConnect" }
                imageName={ "walletconnect.svg" }
                isActive={ connector === walletconnect }
                onClick={ () => {
                    // if the user has already tried to connect, manually reset the connector
                    if (connector?.walletConnectProvider?.wc?.uri) {
                        connector.walletConnectProvider = undefined;
                    }
                    onConnectionClicked("WalletConnect");
                } }
                imageStyle={ { height: "100%", width: "100%" } }
            />
        </>
    );
}

function InnerModal({ children, isAccount }) {
    return <div className={ "pa4 " + (isAccount ? "pt0" : "") }>{ children }</div>;
}

function WalletListItem({
                            name,
                            imageName,
                            onClick,
                            isActive,
                            imageStyle = {},
                        }) {
    return (
        <div
            onClick={ onClick ? onClick : null }
            className={ classNames(
                "br3 mb3 ph3 pv2 ba b--black-10 flex justify-between items-center pointer",
                {
                    "hover-b--primary5": !isActive,
                    "bg-gray8": isActive,
                }
            ) }
        >
            <div className="f5 flex items-center">
                { isActive ? (
                    <div className="flex items-center justify-center green">
                        <div
                            className="mr2 bg-green br-100"
                            style={ { height: "8px", width: "8px" } }
                        >
                            <div/>
                        </div>
                    </div>
                ) : null }
                { name }
            </div>
            <div className="w2 h2">
                <img
                    src={ MetaMaskLogo }
                    alt={ name + "-" + imageName }
                    style={ imageStyle }
                />
            </div>
        </div>
    );
}

function WalletAccount({ setWalletView }) {
    const { account, connector } = useWeb3React();

    function getStatusIcon() {
        if (connector === injected) {
            return <Identicon/>;
        } else if (connector === walletconnect) {
            return (
                <div className="h1 w1 ml3">
                    <img src={ WalletConnectIcon } alt={ "walletconnect logo" }/>
                </div>
            );
        }
    }

    function getName() {
        if (connector === injected) {
            return "MetaMask";
        } else if (connector === walletconnect) {
            return "WalletConnect";
        }
    }

    return (
        <div className="br3 pa3 ba b--black-10">
            <div className="flex justify-between items-center mb3">
                <div className="f6 gray3">Connected with { getName() }</div>
                <button
                    className="outline-0 f6 link br4 ba ph2 pv1 dib primary5 bg-primary9 underline-hover pointer"
                    onClick={ () => setWalletView(WALLET_VIEWS.OPTIONS) }
                >
                    Change
                </button>
            </div>
            <div className="flex items-center mb3">
                { getStatusIcon() }
                <span className="ml2 f4 fw5">{ shortenAddress(account) }</span>
            </div>
            <div className="flex items-center">
                <CopyHelper toCopy={ account }>
                    <span style={ { marginLeft: "4px" } }>Copy Address</span>
                </CopyHelper>
            </div>
        </div>
    );
}
