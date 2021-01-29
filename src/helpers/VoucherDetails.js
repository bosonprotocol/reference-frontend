import { Link } from "react-router-dom";
import { MODAL_TYPES, ROUTE, OFFER_FLOW_SCENARIO, STATUS, ROLE } from "../helpers/Dictionary";
import { ModalResolver } from "../contexts/Modal";
import { getEncodedTopic, decodeData } from "../hooks/useContract";
import VOUCHER_KERNEL from "../hooks/ABIs/VoucherKernel";
import { SMART_CONTRACTS_EVENTS, VOUCHER_STATUSES } from "../hooks/configs";
import { updateVoucher } from "../hooks/api";
import * as ethers from "ethers";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { commitToBuy } from "../hooks/api";
import ContractInteractionButton from "../components/shared/ContractInteractionButton";

// ------------ Settings related to the status of the voucher

const setEscrowPositions = (status, object) => 
escrowPositionMapping[OFFER_FLOW_SCENARIO[ROLE.BUYER][status]] =
escrowPositionMapping[OFFER_FLOW_SCENARIO[ROLE.SELLER][status]] = object

// xy position of blocks on escrow table
// falsy values will append "display: none"
export const escrowPositionMapping = { }
setEscrowPositions(STATUS.OFFERED, {
  PAYMENT: 1,
  BUYER_DEPOSIT: 1,
  SELLER_DEPOSIT: 2,
})
setEscrowPositions(STATUS.COMMITED, {
  PAYMENT: 2,
  BUYER_DEPOSIT: 2,
  SELLER_DEPOSIT: 2,
})
setEscrowPositions(STATUS.REDEEMED, {
  PAYMENT: 2,
  BUYER_DEPOSIT: 2,
  SELLER_DEPOSIT: 2,
})
setEscrowPositions(STATUS.COMPLAINED, {
  PAYMENT: 1,
  BUYER_DEPOSIT: 3,
  SELLER_DEPOSIT: 1,
})
setEscrowPositions(STATUS.REFUNDED, {
  PAYMENT: 1,
  BUYER_DEPOSIT: 3,
  SELLER_DEPOSIT: 1,
})
setEscrowPositions(STATUS.CANCELLED, {
  PAYMENT: 1,
  BUYER_DEPOSIT: 3,
  SELLER_DEPOSIT: 1,
})
setEscrowPositions(STATUS.FINALIZED, {
  PAYMENT: 3,
  BUYER_DEPOSIT: 3,
  SELLER_DEPOSIT: 1,
})

// assign controlset to statuses
export const controlList = (sharedProps) => {
  const { voucherDetails, voucherSetDetails } = sharedProps
  const CASE = {}

  CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.COMMITED]] =
  CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.REFUNDED]] =
  CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.COMPLAINED]] =
  CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.REDEEMED]] = () => (
    <div className="button gray" onClick={ () => onCoF(sharedProps)} role="button">Cancel or fault</div>
  )

  CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.COMMITED]] = () => (
    <div className="flex dual split">
      <div className="button refund" role="button" onClick={ () => onRefund(sharedProps)}>REFUND</div>
      <Link
        to={ `${ ROUTE.VoucherDetails }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
        <div className="button primary" role="button">REDEEM</div>
      </Link>
    </div>
  )

  CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REDEEMED]] =
  CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REFUNDED]] = () => (
    <div className="button red" role="button" onClick={ () => onComplain(sharedProps)}>COMPLAIN</div>
  )

  CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.OFFERED]] = () => (
    <ContractInteractionButton
        className="button primary"
        handleClick={ () => onCommitToBuy(sharedProps) }
        label={`COMMIT TO BUY ${voucherSetDetails?.price}`}
    />
  )

  return CASE
}

export const determineStatus = (sharedProps) => {
  const { account, voucherDetails, voucherSetDetails } = sharedProps

  const voucherResource = voucherDetails ? voucherDetails : (voucherSetDetails ? voucherSetDetails : false)

  const voucherRoles = {
    owner: voucherResource?.voucherOwner?.toLowerCase() === account?.toLowerCase(),
    holder: voucherResource?.holder?.toLowerCase() === account?.toLowerCase(),
  }

  const statusPropagate = () => (
    voucherResource.FINALIZED ? STATUS.FINALIZED:
    voucherResource.CANCELLED ? STATUS.CANCELLED:
    voucherResource.COMPLAINED ? STATUS.COMPLAINED:
    voucherResource.REFUNDED ? STATUS.REFUNDED:
    voucherResource.REDEEMED ? STATUS.REDEEMED:
    voucherResource.COMMITTED ? STATUS.COMMITED:
    !voucherResource?.qty ? STATUS.VIEW_ONLY:
    !voucherResource.COMMITTED ? STATUS.OFFERED:
    false
  )

  const role = voucherRoles.owner ? ROLE.SELLER : ROLE.BUYER
  const status = voucherResource && statusPropagate()

  return OFFER_FLOW_SCENARIO[role][status]
}

// ------- Functions

export const getControlState = (sharedProps) => {
  const voucherStatus = determineStatus(sharedProps)

  const controls = controlList(sharedProps)

  console.log('status: ', voucherStatus)

  return voucherStatus ? 
  controls[voucherStatus] && controls[voucherStatus]()
  : null
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

export async function onCommitToBuy(props) {
  const { history, modalContext, library, account, setLoading, voucherSetDetails, cashierContract } = props

  if (!library || !account) {
      modalContext.dispatch(ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: 'Please connect your wallet account'
      }));
      return;
  }

  setLoading(1)

  const voucherSetInfo = voucherSetDetails;

  if (voucherSetInfo.voucherOwner.toLowerCase() === account.toLowerCase()) {
      setLoading(0);
      modalContext.dispatch(ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: 'The connected account is the owner of the voucher set'
      }));
      return;
  }



  const price = ethers.utils.parseEther(voucherSetInfo.price).toString();
  const buyerDeposit = ethers.utils.parseEther(voucherSetInfo.deposit);
  const txValue = ethers.BigNumber.from(price).add(buyerDeposit);
  const supplyId = voucherSetInfo._tokenIdSupply;

  let tx;
  let metadata = {};
  let data;

  try {
      tx = await cashierContract.requestVoucher_ETH_ETH(supplyId, voucherSetInfo.voucherOwner, {
          value: txValue.toString()
      });

      const receipt = await tx.wait();

      let encodedTopic = await getEncodedTopic(receipt, VOUCHER_KERNEL.abi, SMART_CONTRACTS_EVENTS.VoucherCreated);

      data = await decodeData(receipt, encodedTopic, ['uint256', 'address', 'address', 'bytes32']);

  } catch (e) {
      setLoading(0);
      modalContext.dispatch(ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message
      }));
      return;
  }

  metadata = {
      txHash: tx.hash,
      _tokenIdSupply: supplyId,
      _tokenIdVoucher: data[0].toString(),
      _issuer: data[1],
      _holder: data[2]
  };

  const authData = getAccountStoredInLocalStorage(account);

  try {
      const commitToBuyResponse = await commitToBuy(voucherSetInfo.id, metadata, authData.authToken);
      console.log(commitToBuyResponse);

      history.push(ROUTE.ActivityVouchers)
  } catch (e) {
      setLoading(0);
      modalContext.dispatch(ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content: e.message
      }));
  }

  setLoading(0)
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

export async function onRefund(props) {
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
    tx = await voucherKernelContract.refund(voucherDetails._tokenIdVoucher);

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
      status: VOUCHER_STATUSES.REFUNDED
    };

    const refundResponse = await updateVoucher(data, authData.authToken);
    console.log(refundResponse)
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

export async function onCoF(props) {
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
    tx = await voucherKernelContract.cancelOrFault(voucherDetails._tokenIdVoucher);

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
      status: VOUCHER_STATUSES.CANCELLED
    };

    const cancelResponse = await updateVoucher(data, authData.authToken);
    console.log(cancelResponse)
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