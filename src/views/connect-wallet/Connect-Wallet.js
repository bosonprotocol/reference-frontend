/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  WalletConnect,
  WALLET_VIEWS,
} from "../../shared-components/wallet-connect/WalletConnect";
import { useEagerConnect } from "../../hooks";
import { NetworkContextName } from "../../constants";
import { network } from "../../Connectors";
// import { shortenAddress } from "../utils";

import "./Connect-Wallet.scss";

const ACTION = {
  GET_DATA: {
    getData: true,
  },
};

export default function ConnectWallet() {
  const [walletView, setWalletView] = useState(WALLET_VIEWS.OPTIONS);
  const context = useWeb3React();

  const { active } = context;

  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React(NetworkContextName);

  const triedEager = useEagerConnect();
  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network);
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
    const isRedirect = urlParams.get("redirect");
    if (isRedirect !== null) {
      localStorage.setItem("redirect", isRedirect);
    }
  }, []);

  const ConnectedWallet = (
    <WalletConnect
      getData={ACTION.GET_DATA}
      walletView={walletView}
      setWalletView={setWalletView}
    />
  );

  return (
    <section className="connect activity">
      <div className="container l">
        <h1>Wallet</h1>
        {ConnectedWallet}
      </div>
    </section>
  );
}

/* <div className="bind column">
<div className="top-navigation flex ai-center">
    <div className="button square" role="button" onClick={ goToHomeScreen }>
        <Arrow/>
    </div>
</div>
<div className="content">
    { getWalletTitle({ account, walletView, setWalletView }) }
    <WalletConnect walletView={ walletView } setWalletView={ setWalletView }/>
</div>
</div> */