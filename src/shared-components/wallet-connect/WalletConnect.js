/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useContext } from "react";
import classNames from "classnames";
import { useWeb3React } from "@web3-react/core";
import { usePrevious } from "../../hooks";
import { ChainLabels, shortenAddress } from "../../utils/BlockchainUtils";
import { injected, SUPPORTED_CHAIN_IDS, walletconnect } from "../../Connectors";
import WalletConnectIcon from "../../assets/wallets/walletconnect.svg";
import MetaMaskLogo from "../../assets/wallets/metamask.png";
import WalletConnectLogo from "../../assets/wallets/walletconnect.svg";
import Identicon from "./identicon/Identicon";
import CopyHelper from "../../helpers/CopyHelper";
import "./WalletConnect.scss";
import { WalletContext } from "../../contexts/Wallet";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { isMobile } from "@walletconnect/utils";

export const WALLET_VIEWS = {
  OPTIONS: "options",
  OPTIONS_SECONDARY: "options_secondary",
  ACCOUNT: "account",
  PENDING: "pending",
};

export const CONNECTOR_TYPES = {
  METAMASK: "MetaMask",
  WALLET_CONNECT: "WalletConnect",
};

export function WalletConnect({
  onSuccess,
  setWalletView,
  walletView = WALLET_VIEWS.ACCOUNT,
  getData,
}) {
  const isMounted = useRef(false);
  const context = useWeb3React();
  const { chainId, connector, account, activate, active, error } = context;

  const walletContext = useContext(WalletContext);
  const connectorsByName = walletContext.walletState.connectorsByName;

  const previousAccount = usePrevious(account);

  const { ethereum } = window;
  const isMetaMask = !!(ethereum && ethereum.isMetaMask);

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
    if (name === CONNECTOR_TYPES.WALLET_CONNECT) {
      const walletConnectData = localStorage.getItem("walletconnect");

      const walletConnectDataObject = JSON.parse(walletConnectData);
      if (
        walletConnectDataObject &&
        !SUPPORTED_CHAIN_IDS.includes(walletConnectDataObject.chainId)
      ) {
        // ToDo: Use Global notification
        console.error(
          `Unsupported network (chainID=${walletConnectDataObject.chainId})`
        );
        return;
      }
    }

    const current = connectorsByName[name];
    localStorage.setItem("previous-connector", name);
    activate(current);
  }

  function walletConnectAccountChanged() {
    onConnectionClicked(CONNECTOR_TYPES.WALLET_CONNECT);
  }

  return (
    <>
      <div className="wallet-holder">
        {account && active ? (
          <WalletAccount
            onWalletConnectAccountChanged={() => {
              walletConnectAccountChanged();
            }}
          />
        ) : null}
        <div className={`wallets ${account && active ? "has-wallet f1" : ""}`}>
          {!isMobile() ? (
            !(window.web3 || window.ethereum) ? (
              <a
                href={"https://metamask.io/"}
                target={"_blank"}
                rel={"noreferrer"}
              >
                <WalletListItem
                  name={CONNECTOR_TYPES.METAMASK}
                  imageName={MetaMaskLogo}
                  isActive={false}
                  onClick={null}
                  hasWallet={account && active}
                />
              </a>
            ) : (
              <WalletListItem
                name={CONNECTOR_TYPES.METAMASK}
                imageName={MetaMaskLogo}
                isActive={connector === injected && active}
                hasWallet={account && active}
                onClick={() => {
                  onConnectionClicked(CONNECTOR_TYPES.METAMASK);
                }}
              />
            )
          ) : null}
          {isMetaMask && isMobile() ? null : (
            <WalletListItem
              name={CONNECTOR_TYPES.WALLET_CONNECT}
              imageName={WalletConnectLogo}
              isActive={connector === walletconnect && active}
              hasWallet={account && active}
              onClick={() => {
                // if the user has already tried to connect, manually reset the connector
                if (connector?.walletConnectProvider?.wc?.uri) {
                  connector.walletConnectProvider = undefined;
                }
                onConnectionClicked(CONNECTOR_TYPES.WALLET_CONNECT);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

function WalletListItem({
  name,
  imageName,
  onClick,
  isActive,
  hasWallet,
  imageStyle = {},
}) {
  return (
    <div
      onClick={onClick ? onClick : null}
      className={classNames("wallet-list-item", {
        "hover-b--primary5": !isActive,
        "active-connector": isActive,
      })}
    >
      <div className="wallet-list-item-image-holder">
        <img src={imageName} alt={name + "-" + imageName} style={imageStyle} />
      </div>
      <div
        className={classNames("list-item-option", {
          "metamask-label": name === CONNECTOR_TYPES.METAMASK,
        })}
      >
        {name}
      </div>
      {hasWallet ? (
        <div className="status">
          {isActive ? (
            <div className="active-wallet-indicator">
              <img src="images/wallets/active-wallet.png" alt="Active wallet" />{" "}
              Connected
            </div>
          ) : (
            <div className={`button gray`} role="button">
              {!(window.web3 || window.ethereum) &&
              name === CONNECTOR_TYPES.METAMASK
                ? "INSTALL"
                : "CONNECT"}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function WalletAccount({ onWalletConnectAccountChanged }) {
  const { account, connector, chainId, activate, deactivate } = useWeb3React();

  function getStatusIcon() {
    if (connector === injected) {
      return <Identicon />;
    } else if (connector === walletconnect) {
      return (
        <div className="">
          <img src={WalletConnectIcon} alt={"walletconnect logo"} />
        </div>
      );
    }
  }

  const copyButton = (
    <CopyHelper toCopy={account}>
      <span style={{ marginLeft: "4px", textTransform: "none" }}>
        Copy Address
      </span>
    </CopyHelper>
  );

  function removeWallet() {
    localStorage.removeItem("walletconnect");
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    ) {
      connector.walletConnectProvider = undefined;
    }
    deactivate();
    connector.deactivate();
  }

  function changeWalletConnectedWithWalletConnect() {
    removeWallet();
    activate(walletconnect).then(() => {
      onWalletConnectAccountChanged();
    });
  }

  return (
    <>
      <div className="connected-wallet">
        <div className="address relative">
          {chainId ? (
            <div className="network-info flex center">
              <span className={`net-name`}>{ChainLabels[chainId]}</span>
            </div>
          ) : null}
          <div className="url flex ai-center">
            {getStatusIcon()}
            {shortenAddress(account)}
          </div>
          <div className="copy">{copyButton}</div>
          {connector === walletconnect ? (
            <div className={`wallet-connect-buttons-wrapper`}>
              <div
                className={`button gray`}
                role="button"
                onClick={removeWallet}
              >
                Remove
              </div>
              <div
                className={`button change gray`}
                role="button"
                onClick={changeWalletConnectedWithWalletConnect}
              >
                Change
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
