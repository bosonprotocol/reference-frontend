import { useEffect, useContext } from 'react';
import { GlobalContext, Action } from "../contexts/Global";
import { fetchVoucherSets } from "../helpers/VoucherParsers";

function PopulateVouchers() {
  const globalContext = useContext(GlobalContext)

  // application init
  useEffect(() => {
    fetchVoucherSets().then(result => {
      globalContext.dispatch(Action.allVoucherSets(result))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalContext.state.fetchVoucherSets])

  return null
}

export default PopulateVouchers
