/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext, useState } from 'react';
import { GlobalContext, Action } from "../contexts/Global";
import { ModalContext } from "../contexts/Modal";
import { useWeb3React } from "@web3-react/core";
import { fetchVoucherSets, getAccountVouchers, addNewVoucher } from "../helpers/VoucherParsers"
import { getVoucherDetails } from "../hooks/api"

function PopulateVouchers() {
  const [fetchAccountVouchers, setFetchAccountVouchers] = useState(1)
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
    globalContext.dispatch(Action.updateAccount(account))
    setFetchAccountVouchers(fetchAccountVouchers * -1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, globalContext.state.checkDataUpdate])

  useEffect(() => {
    const fetchVoucherDetails = async (accountVouchers) => {
      let allVouchersArray = []
      for (const voucher of accountVouchers) {
        let result = await addNewVoucher(account, getVoucherDetails, voucher.id)
        if(result) allVouchersArray.push(result)
      }
      return allVouchersArray
    }

    getAccountVouchers(account, modalContext).then(accountVouchers => {
      globalContext.dispatch(Action.updateAllVouchers(accountVouchers))
      if(accountVouchers) fetchVoucherDetails(accountVouchers).then(vouchDetails => {
        if(vouchDetails.length > 0) globalContext.dispatch(Action.accountVouchers(vouchDetails))
      })
    })
  }, [fetchAccountVouchers])

  return null
}

export default PopulateVouchers
