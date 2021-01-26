import { Link } from "react-router-dom";
import { MODAL_TYPES, ROUTE, SCENARIO } from "../helpers/Dictionary";
import { ModalResolver } from "../contexts/Modal";
import { getEncodedTopic } from "../hooks/useContract";
import VOUCHER_KERNEL from "../hooks/ABIs/VoucherKernel";
import { SMART_CONTRACTS_EVENTS, VOUCHER_STATUSES } from "../hooks/configs";
import { updateVoucher } from "../hooks/api";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";

// ------------ Settings related to the status of the voucher

// xy position of blocks on escrow table
// falsy values will append "display: none"
export const escrowPositionMapping = {
  [SCENARIO.HOLDER_REDEEMED]: {
    PAYMENT: 2,
    BUYER_DEPOSIT: 2,
    SELLER_DEPOSIT: 2,
  },
  [SCENARIO.HOLDER_COMMITED]: {
    PAYMENT: 2,
    BUYER_DEPOSIT: 2,
    SELLER_DEPOSIT: 2,
  },
  [SCENARIO.DEFAULT]: {
    PAYMENT: 1,
    BUYER_DEPOSIT: 1,
    SELLER_DEPOSIT: 3,
  },
}

// assign controlset to statuses
export const controlList = (voucherDetails, sharedProps) => ({
  [SCENARIO.OWNER_GENERAL]: () => (
    < div className="button gray" disabled role="button">Cancel or fault</div>
  ),
  [SCENARIO.HOLDER_COMMITED]: () => (
    <Link
      to={ `${ ROUTE.VoucherDetails }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
      <div className="button primary" role="button">REDEEM</div>
    </Link>
  ),
  [SCENARIO.HOLDER_REDEEMED]: () => (
    < div className="button red" role="button" onClick={ () => onComplain(sharedProps)}>COMPLAIN</div>
  ),
  [SCENARIO.DEFAULT]: () => (
    < div className="button gray" role="button" disabled >WAITING</div>
  ),
})

export const determineStatus = (sharedProps) => {
  const { account, voucherDetails } = sharedProps

  // status information about the voucher
  const voucherInfo = {
    owner: null,
    holder: null,
    commited: null,
    redeemed: null,
  }

  // define checks for the current voucher
  const isOwner = (voucher) => voucher ? voucher.voucherOwner.toLowerCase() === account?.toLowerCase() : null
  const isHolder = (voucher) => voucher ? voucher.holder.toLowerCase() === account?.toLowerCase() : null
  const isCommited = (voucher) => voucher ? voucher.COMMITTED !== null : null
  const isRedeemed = (voucher) => voucher ? voucher.REDEEMED !== null : null
  const isComplained = (voucher) => voucher ? voucher.COMPLAINED !== null : null

  // update the information about the voucher by running defined checks
  const updateVoucherStatus = (voucher) => {
    voucherInfo.owner = isOwner(voucher)
    voucherInfo.holder = isHolder(voucher)
    voucherInfo.commited = isCommited(voucher)
    voucherInfo.redeemed = isRedeemed(voucher)
    voucherInfo.complained = isComplained(voucher)
  }

  // run checks
  updateVoucherStatus(voucherDetails)

  // perform a check on the current voucher and return relevant SCENARIO
  if(voucherInfo.owner && voucherInfo.commited && !voucherInfo.redeemed) return SCENARIO.OWNER_GENERAL
  if(voucherInfo.holder && voucherInfo.commited && !voucherInfo.redeemed) return SCENARIO.HOLDER_COMMITED
  if(voucherInfo.holder && voucherInfo.commited && voucherInfo.redeemed && !voucherInfo.complained) return SCENARIO.HOLDER_REDEEMED
  return SCENARIO.DEFAULT
}

// ------- Functions

export const getControlState = (sharedProps) => {
  const { voucherDetails } = sharedProps

  const voucherStatus = determineStatus(sharedProps)

  const controls = controlList(voucherDetails, sharedProps)

  return voucherStatus ? 
    controls[voucherStatus]()
  : null
}

export async function onComplain(props) {
  const { modalContext, library, account, setLoading, voucherKernelContract, voucherDetails, voucherId } = props
  
  if (!library || !account) {
    modalContext.dispatch(ModalResolver.showModal({
      show: true,
      type: MODAL_TYPES.GENERIC_ERROR,
      content: 'Please connect your wallet account'
    }));
    return;
  }

  setLoading(1);

  let tx;
  const authData = getAccountStoredInLocalStorage(account);

  try {
    tx = await voucherKernelContract.complain(voucherDetails._tokenIdVoucher);

    const receipt = await tx.wait();
    console.log(receipt, 'receipt')

    let encodedTopic = await getEncodedTopic(receipt, VOUCHER_KERNEL.abi, SMART_CONTRACTS_EVENTS.VoucherRedeemed);
    console.log(encodedTopic, 'encodedTopic')

  } catch (e) {
    setLoading(0);
    modalContext.dispatch(ModalResolver.showModal({
      show: true,
      type: MODAL_TYPES.GENERIC_ERROR,
      content: e.message + ' :233'
    }));
    return;
  }


  try {
    const data = {
      _id: voucherId,
      status: VOUCHER_STATUSES.COMPLAINED
    };

    const complainResponse = await updateVoucher(data, authData.authToken);
    console.log(complainResponse)
  } catch (e) {
    setLoading(0);
    modalContext.dispatch(ModalResolver.showModal({
      show: true,
      type: MODAL_TYPES.GENERIC_ERROR,
      content: e.message + ' :252'
    }));
  }

  setLoading(0)
}

export const prepareEscrowData = (sharedProps) => {
  const { voucherDetails, voucherStatus } = sharedProps

  return escrowPositionMapping[voucherStatus] ?
  {
    PAYMENT: {
      title: 'PAYMENT',
      value: `${ voucherDetails?.price } ${voucherDetails?.currency}`,
      position: escrowPositionMapping[voucherStatus]?.PAYMENT,
    },
    BUYER_DEPOSIT: {
      title: 'BUYER DEPOSIT',
      value: `${ voucherDetails?.buyerDeposit } ${voucherDetails?.currency}`,
      position: escrowPositionMapping[voucherStatus]?.BUYER_DEPOSIT,
    },
    SELLER_DEPOSIT: {
      title: 'SELLER DEPOSIT',
      value: `${ voucherDetails?.sellerDeposit } ${voucherDetails?.currency}`,
      position: escrowPositionMapping[voucherStatus]?.SELLER_DEPOSIT,
    },
  }
  : false
}