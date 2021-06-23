import React, { useContext, useEffect, useState } from "react";

import { useHistory, useLocation } from "react-router";

import { Link } from "react-router-dom";

import { NavigationContext } from "../../../contexts/Navigation";
import { GlobalContext } from "../../../contexts/Global";
import {
  LoadingContext,
  account as loadingAccount,
} from "../../../contexts/Loading";

import {
  AFFMAP,
  QUERY_PARAMS,
  ROUTE,
} from "../../../helpers/configs/Dictionary";

import logo from "./../../../assets/boson/leptonite.png";

import "./TopNavigation.scss";

import { IconQR, Arrow } from "../../icons/Icons";
import { useWeb3React } from "@web3-react/core";
import { ChainLabels, shortenAddress } from "../../../utils/BlockchainUtils";
import { injected, walletconnect } from "../../../Connectors";
import MetaMaskLogo from "../../../assets/wallets/metamask.png";
import WalletConnectLogo from "../../../assets/wallets/walletconnect.svg";

import OfferFlowSet from "./offer-flow-set/OfferFlowSet";
import { height } from "dom7";

function TopNavigation() {
  const navigationContext = useContext(NavigationContext);
  const globalContext = useContext(GlobalContext);
  const history = useHistory();
  const location = useLocation();
  const { account, connector, chainId } = useWeb3React();
  const query = new URLSearchParams(location.search);

  const navigate = () => {
    if (
      location.pathname === ROUTE.Connect ||
      location.pathname === ROUTE.Activity ||
      location.pathname === ROUTE.ActivityVouchers ||
      location.pathname === ROUTE.Search ||
      location.pathname === ROUTE.PickUpLocation
    ) {
      history.push(ROUTE.Home);
      return;
    }

    if (location.pathname.startsWith(ROUTE.Activity)) {
      const visitedDirectly = query.get(QUERY_PARAMS.DIRECT);

      if (visitedDirectly) {
        history.push(ROUTE.Home);
        return;
      }

      const searchCriteria = query.get(QUERY_PARAMS.SEARCH_CRITERIA);

      if (searchCriteria) {
        history.push(
          `${ROUTE.Search}?${QUERY_PARAMS.SEARCH_CRITERIA}=${searchCriteria}`
        );
        return;
      }

      if (location.pathname.endsWith(ROUTE.Details)) {
        const supplyRoute = location.pathname.replace(
          ROUTE.Details,
          ROUTE.VoucherSetView
        );
        history.push(supplyRoute);
        return;
      }

      if (location.pathname.endsWith(ROUTE.VoucherSetView)) {
        history.push(ROUTE.Activity);
        return;
      }
    }

    if (location.pathname.startsWith(ROUTE.ActivityVouchers)) {
      const voucherSetId = query.get(QUERY_PARAMS.VOUCHER_SET_ID);

      if (voucherSetId) {
        const voucherSetRoute = `${ROUTE.Activity}/${voucherSetId}${ROUTE.VoucherSetView}`;
        history.push(voucherSetRoute);
        return;
      }

      history.push(ROUTE.ActivityVouchers);
      return;
    }

    history.goBack();
  };

  const hideTopNavigation =
    location.pathname === ROUTE.Connect ||
    location.pathname === ROUTE.Activity ||
    location.pathname === ROUTE.ActivityVouchers;

  return (
    <div>
      {hideTopNavigation ? null : (
        <header
          className={`top-navigation ${
            !globalContext.state.onboardingCompleted ? "d-none" : ""
          }`}
        >

          <div className="container">
            <nav className="flex split">
              {/* <div className="desktop">
                <img src={logo}></img>
              </div> */}
              {/* <div style={{ borderWidth: "10px" }}><p>blabla</p></div> */}
              {/* Wallet Connection Button */}
              {navigationContext.state.top[AFFMAP.WALLET_CONNECTION] ? (
                // <div className="flex row" style={{marginLeft: "auto"}}>
                <div className="flex row">
                  <WalletConnection account={account} connector={connector} />
                  {chainId ? (
                    <div className="network-info flex center">
                      <span className={`net-name`}>{ChainLabels[chainId]}</span>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Back button */}
              {navigationContext.state.top[AFFMAP.BACK_BUTTON] ? (
                <div
                  className="button square new"
                  role="button"
                  onClick={() => navigate()}
                  id="topNavBackButton"
                >
                  <Arrow color="#80F0BE" />
                </div>
              ) : null}

              {/* QR Reader button */}
              {navigationContext.state.top[AFFMAP.QR_CODE_READER] ? (
                <Link to={ROUTE.CodeScanner}>
                  <div className="qr-icon" role="button">
                    <IconQR color="#8393A6" noBorder />
                  </div>
                </Link>
              ) : null}
              {/* NewOffer Set */}
              {navigationContext.state.top[AFFMAP.OFFER_FLOW_SET] ? (
                <OfferFlowSet />
              ) : null}
            </nav>
          </div>
        </header>
      )}
    </div>
  );
}

const WalletConnection = (props) => {
  const { account, connector } = props;
  const [pageLoading, setPageLoading] = useState(1);
  const loadingContext = useContext(LoadingContext);

  useEffect(() => {
    setPageLoading(loadingContext.state[loadingAccount.button]);
  }, [loadingContext.state]);
  return (
    <Link to={ROUTE.Connect}>
      {account ? (
        <div
          className={`button flex ${
            pageLoading ? "is-loading" : ""
          } ai-center connected-account-button`}
          role="button"
        >
          <img
            className="provider-logo"
            src={
              connector === injected
                ? MetaMaskLogo
                : connector === walletconnect
                ? WalletConnectLogo
                : null
            }
            alt="Connected account"
          />
          <div className="active-wallet-indicator flex">
            <img src="images/wallets/active-wallet.png" alt="Active wallet" />
          </div>
          <span>{shortenAddress(account)}</span>
        </div>
      ) : (
        <div
          className={`button linear ${pageLoading ? "is-loading" : ""}`}
          role="button"
        >
          Connect to a wallet
        </div>
      )}
    </Link>
  );
};

export default TopNavigation;
