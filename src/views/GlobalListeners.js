/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react';
import { GlobalContext, Action } from "../contexts/Global";
import { useWeb3React } from "@web3-react/core";
import { fetchVoucherSets } from "../helpers/VoucherParsers"
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";

function PopulateVouchers() {
    const globalContext = useContext(GlobalContext)

    const { account } = useWeb3React();

    // application init
    useEffect(() => {
        fetchVoucherSets().then(result => {
            globalContext.dispatch(Action.allVoucherSets(result))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalContext.state.fetchVoucherSets])

    useEffect(() => {
        globalContext.dispatch(Action.updateAccount(account));

        const localStoredAccountData = getAccountStoredInLocalStorage(account);

        if (!localStoredAccountData?.activeToken) {
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

    return null
}

export default PopulateVouchers
