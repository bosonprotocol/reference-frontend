import { useEffect, useContext } from 'react';
import { GlobalContext, Action } from "../contexts/Global";
import { useWeb3React } from "@web3-react/core";
import { fetchVoucherSets, getAccountVouchers } from "../helpers/VoucherParsers"
import { ModalContext } from "../contexts/Modal";



function PopulateVouchers() {
  const globalContext = useContext(GlobalContext)
  const modalContext = useContext(ModalContext);

  const { account } = useWeb3React();

  // application init
  useEffect(() => {
    fetchVoucherSets().then(result => {
      globalContext.dispatch(Action.allVoucherSets(result))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalContext.state.fetchVoucherSets])

  useEffect(() => {
    getAccountVouchers(account, modalContext).then(result => {
      globalContext.dispatch(Action.accountVouchers(result))
      globalContext.dispatch(Action.updateAllVouchers(result))
    })

    globalContext.dispatch(Action.updateAccount(account))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return null
}

export default PopulateVouchers
