/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext, useRef } from "react";
import { GlobalContext, Action } from "../contexts/Global";
import {
  LoadingContext,
  Toggle,
  account as loadingAccount,
} from "../contexts/Loading";
import { useWeb3React } from "@web3-react/core";
import { fetchVoucherSets } from "../helpers/parsers/VoucherAndSetParsers";
import { getAccountStoredInLocalStorage } from "./authenticate";
import { useHistory } from "react-router-dom";

function PopulateVouchers() {
  const globalContext = useContext(GlobalContext);
  const loadingContext = useContext(LoadingContext);

  const { account } = useWeb3React();

  const history = useHistory();

  const isMounted = useRef(false);

  // application init
  useEffect(() => {
    fetchVoucherSets().then((result) => {
      globalContext.dispatch(Action.allVoucherSets(result));
    });
  }, [globalContext.state.fetchVoucherSets]);

  useEffect(() => {
    globalContext.dispatch(Action.updateAccount(account));

    const localStoredAccountData = getAccountStoredInLocalStorage(account);

    localStorage.setItem("isAuthenticated", `${!!localStoredAccountData}`);

    setTimeout(() => {
      loadingContext.dispatch(Toggle.Loading(loadingAccount?.button, 0));
    }, 500);

    if (!localStoredAccountData?.activeToken) {
      return;
    }

    if (localStoredAccountData) {
      loadingContext.dispatch(Toggle.Loading(loadingAccount?.button, 0));
    }

    if (isMounted.current) {
      history.push("/");
    } else {
      isMounted.current = true;
    }
  }, [account]);

  useEffect(() => {
    if (globalContext.state.selectedCity === "") {
      fetchVoucherSets().then((result) => {
        globalContext.dispatch(Action.allVoucherSets(result));
      });
    }
  }, [globalContext.state.selectedCity]);

  useEffect(() => {
    loadingContext.dispatch(Toggle.Loading(loadingAccount?.button, 1));
  }, []);

  return null;
}

export default PopulateVouchers;
