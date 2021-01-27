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

// ------------ Settings related to the status of the voucher

// xy position of blocks on escrow table
// falsy values will append "display: none"
export const escrowPositionMapping = {
  [OFFER_FLOW_SCENARIO.HOLDER_REDEEMED]: {
    PAYMENT: 2,
    BUYER_DEPOSIT: 2,
    SELLER_DEPOSIT: 2,
  },
  [OFFER_FLOW_SCENARIO.HOLDER_COMMITED]: {
    PAYMENT: 2,
    BUYER_DEPOSIT: 2,
    SELLER_DEPOSIT: 2,
  },
  [OFFER_FLOW_SCENARIO.DEFAULT]: {
    PAYMENT: 1,
    BUYER_DEPOSIT: 1,
    SELLER_DEPOSIT: 3,
  },
}

// assign controlset to statuses
export const controlList = (sharedProps) => {
  const { voucherDetails, voucherSetDetails } = sharedProps

  return {
    [OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.COMMITED]]: () => (
      <div className="button gray" disabled role="button">Cancel or fault</div>
    ),
    [OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.COMMITED]]: () => (
      <Link
        to={ `${ ROUTE.VoucherDetails }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
        <div className="button primary" role="button">REDEEM</div>
      </Link>
    ),
    [OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REDEEMED]]: () => (
      <div className="button red" role="button" onClick={ () => onComplain(sharedProps)}>COMPLAIN</div>
    ),
    [OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.OFFERED]]: () => (
    <div className="button primary" role="button" onClick={ () => onCommitToBuy(sharedProps) }>COMMIT TO BUY {voucherSetDetails?.price}</div>
    ),
    [OFFER_FLOW_SCENARIO.DEFAULT]: () => ( // TESTS - THIS SHOULDNT SHOW UP
      <div className="button gray" role="button" disabled >WAITING</div>
    ),
  }
}

export const determineStatus = (sharedProps) => {
  const { account, voucherDetails } = sharedProps

  // status information about the voucher
  const voucher = voucherDetails ?  {
    owner: voucherDetails.voucherOwner.toLowerCase() === account?.toLowerCase(),
    holder: voucherDetails.holder.toLowerCase() === account?.toLowerCase(),
    commited: voucherDetails.COMMITTED !== null,
    redeemed: voucherDetails.REDEEMED !== null,
    complained: voucherDetails.COMPLAINED !== null,
    refunded: voucherDetails.REFUNDED !== null,
    // canceled: voucherDetails.CANCELED !== null,
  } : {}

  const performStatusChecks = () => {
    return (
      (!voucherDetails) ? STATUS.OFFERED:
      (voucher.commited && !voucher.redeemed && !voucher.refunded && !voucher.canceled) ? STATUS.COMMITED:
      (voucher.redeemed && !voucher.refunded && !voucher.canceled) ? STATUS.REDEEMED:
      (voucher.complained) ? STATUS.COMPLAINED:
      (voucher.refunded) ? STATUS.REFUNDED:
      // (voucher.canceled) ? STATUS.CANCELED:
      false
    )
  }

  const status = performStatusChecks()
  const role = voucher.owner ? ROLE.SELLER : ROLE.BUYER

  return OFFER_FLOW_SCENARIO[role][status]
}

// ------- Functions

export const getControlState = (sharedProps) => {
  const voucherStatus = determineStatus(sharedProps)

  const controls = controlList(sharedProps)

  return voucherStatus ? 
    controls[voucherStatus]()
  : null
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