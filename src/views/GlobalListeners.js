/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react';
import { GlobalContext, Action } from "../contexts/Global";
import { LoadingContext, Toggle, account as loadingAccount } from "../contexts/Loading";
import { useWeb3React } from "@web3-react/core";
import { fetchVoucherSets } from "../helpers/VoucherParsers"
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";

function PopulateVouchers() {
    const globalContext = useContext(GlobalContext)
    const loadingContext = useContext(LoadingContext)

    const { account } = useWeb3React();

    // application init
    useEffect(() => {
        fetchVoucherSets().then(result => {
            globalContext.dispatch(Action.allVoucherSets(result))
        })
    }, [globalContext.state.fetchVoucherSets])

    useEffect(() => {
        globalContext.dispatch(Action.updateAccount(account));

        const localStoredAccountData = getAccountStoredInLocalStorage(account);
        
        localStorage.setItem('isAuthenticated', `${!!localStoredAccountData}`)

        setTimeout(() => {
            loadingContext.dispatch(Toggle.Loading(loadingAccount?.button, 0))
        }, 500)

        
        if (!localStoredAccountData?.activeToken) {
            return;
        }

        if(localStoredAccountData) {
            loadingContext.dispatch(Toggle.Loading(loadingAccount?.button, 0))
        }
    }, [account])

    useEffect(() => {
        loadingContext.dispatch(Toggle.Loading(loadingAccount?.button, 1))
    }, [])

    return null
}

export default PopulateVouchers
