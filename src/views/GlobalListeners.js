/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext, useState } from 'react';
import { GlobalContext, Action } from "../contexts/Global";
import { ModalContext } from "../contexts/Modal";
import { useWeb3React } from "@web3-react/core";
import { fetchVoucherSets, getAccountVouchers, addNewVoucher } from "../helpers/VoucherParsers"
import { getVoucherDetails } from "../hooks/api"
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";

function PopulateVouchers() {
    const [accountVouchers, setAccountVouchers] = useState()
    const globalContext = useContext(GlobalContext)
    const modalContext = useContext(ModalContext)

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

        getAccountVouchers(account, modalContext).then(result => {
            setAccountVouchers(result)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

    useEffect(() => {
        const fetchVoucherDetails = async (accountVouchers) => {
            let allVouchersArray = []
            await accountVouchers?.forEach(voucher => addNewVoucher(account, getVoucherDetails, voucher.id, allVouchersArray))
            return allVouchersArray
        }


        fetchVoucherDetails(accountVouchers).then(result => {
            if (result) globalContext.dispatch(Action.accountVouchers(result))
        })
    }, [accountVouchers])

    return null
}

export default PopulateVouchers
