import React, { useEffect, useState, useRef, useContext } from "react";
import classNames from "classnames";
import { useWeb3React } from "@web3-react/core";
import { usePrevious } from "../../hooks";
import { shortenAddress } from "../../utils";
import Modal from "../shared/Modal";
import { injected, RINKEBY_ID, walletconnect } from "../../connectors";
import WalletConnectIcon from "../../images/walletconnect.svg";
import MetaMaskLogo from "../../images/metamask.png";
import WalletConnectLogo from "../../images/walletconnect.svg";
import Identicon from "./Identicon";
import CopyHelper from "../../copyHelper";
import './WalletConnect.scss'
import { WalletContext } from "../../contexts/Wallet";
import { authenticateUser, getAccountStoredInLocalStorage } from "../../hooks/authenticate";
import { useHistory, useLocation } from 'react-router-dom';

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

    const location = useLocation();
    const history = useHistory();

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
        activate(current);
    }

    useEffect(() => {
        if (library && account) {
            history.push(location?.state?.sourcePath);

            const localStoredAccountData = getAccountStoredInLocalStorage(account);

            if (localStoredAccountData.activeToken) {
                return;
            }

            authenticateUser(library, account, chainId);
        }
        // eslint-disable-next-line
    }, [library, account, chainId]);


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
            />
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
                { isActive ? (
                    <div className="active-wallet-indicator">
                        <img src="images/active-wallet.png"
                             alt="Active wallet"/>
                        <div/>
                    </div>
                ) : null }
                { name }
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
