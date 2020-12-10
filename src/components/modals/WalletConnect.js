import React, { useEffect, useState, useRef, useContext } from "react";
// import Web3 from "web3";
import classNames from "classnames";
import { useWeb3React } from "@web3-react/core";
import { usePrevious } from "../../hooks";
import { shortenAddress } from "../../utils";
import Modal from "../Modal";
import { injected, walletconnect } from "../../connectors";
import WalletConnectIcon from "../../images/walletconnect.svg";
import MetaMaskLogo from "../../images/metamask.png";
import WalletConnectLogo from "../../images/walletconnect.svg";
import Identicon from "../Identicon";
import CopyHelper from "../../copyHelper";
import './WalletConnect.scss'
import { WalletContext } from "../../contexts/Wallet";

export const MODAL_WALLET_CONNECT = "modal_wallet_connect";

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

    const walletContext = useContext(WalletContext);
    const connectorsByName = walletContext.walletState.connectorsByName;

    const previousAccount = usePrevious(account);

    // console.log("Library ---------------");
    // console.log(library);

    // console.log("Account ----------------");
    // console.log(account);

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
                imageName={ MetaMaskLogo }
                isActive={ connector === injected }
                onClick={ () => onConnectionClicked("MetaMask") }
            />
            <WalletListItem
                name={ "WalletConnect" }
                imageName={ WalletConnectLogo }
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
                "wallet-list-item",
                {
                    "hover-b--primary5": !isActive,
                    "active-connector": isActive,
                }
            ) }
        >
            <div className="">
                { isActive ? (
                    <div className="">
                        <div
                            className=""
                            style={ { height: "8px", width: "8px" } }
                        >
                            <div/>
                        </div>
                    </div>
                ) : null }
                { name }
            </div>
            <div className="wallet-list-item-image-holder">
                <img
                    src={ imageName }
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
                <div className="">
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
        <div className="connected-account">
            <div className="connected-with">
                <div className="connected-with-title">Connected with { getName() }</div>
                <button
                    className="button primary change-connector-button"
                    onClick={ () => setWalletView(WALLET_VIEWS.OPTIONS) }
                >
                    Change
                </button>
            </div>
            <div className="connected-account-address-holder">
                <div className="connected-account-address">
                    { getStatusIcon() }
                    <span className="">{ shortenAddress(account) }</span>
                </div>
                <div className="copy-account-address">
                    <CopyHelper toCopy={ account }>
                        <span style={ { marginLeft: "4px" } }>Copy Address</span>
                    </CopyHelper>
                </div>
            </div>
        </div>
    );
}
