import { Link } from "react-router-dom";
import { MODAL_TYPES, OFFER_FLOW_SCENARIO, ROLE, ROUTE, STATUS } from "./Dictionary";
import { ModalResolver } from "../contexts/Modal";
import { decodeData, getEncodedTopic } from "../hooks/useContract";
import VOUCHER_KERNEL from "../hooks/ABIs/VoucherKernel";
import { SMART_CONTRACTS_EVENTS, VOUCHER_STATUSES } from "../hooks/configs";
import { commitToBuy, getPaymentsDetails, updateVoucher } from "../hooks/api";
import * as ethers from "ethers";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import ContractInteractionButton from "../components/shared/ContractInteractionButton";

// xy position of blocks on escrow table
// falsy values will append "display: none"
export const escrowPositionMapping = {
  PAYMENT: [0],
  BUYER_DEPOSIT: [0],
  SELLER_DEPOSIT: [0],
}

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
  CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.CANCELLED]] =
  CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REFUNDED]] = () => (
    <div className="button red" role="button" onClick={ () => onComplain(sharedProps)}>COMPLAIN</div>
  )

  CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.OFFERED]] = 
  CASE[OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.OFFERED]] = () => (
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

  const role = voucherRoles.owner ? ROLE.SELLER : voucherRoles.holder ? ROLE.BUYER : ROLE.NON_BUYER_SELLER
  const status = voucherResource && statusPropagate()

  // don't show actions if:
  const blockActionConditions = [
    new Date() >= new Date(voucherResource?.expiryDate), // voucher expired
    new Date() <= new Date(voucherResource?.startDate), // has future start date
    voucherResource?.qty <= 0, // no quantity
  ]

  // status: undefined - user that has not logged in
  return !blockActionConditions.includes(true) ? OFFER_FLOW_SCENARIO[role][status] : undefined
}

// ------- Functions

export const getControlState = (sharedProps) => {
    const voucherStatus = determineStatus(sharedProps)

    const controls = controlList(sharedProps)

    return voucherStatus ?
        controls[voucherStatus] && controls[voucherStatus]()
        : null
}

export const prepareEscrowData = async (sharedProps) => {
    const { voucherDetails, account, modalContext } = sharedProps;
    const payments = await getPayments(voucherDetails, account, modalContext);

    const getPaymentMatrixSet = (row, column) => ethers.utils.formatEther(payments.distributedAmounts[row][column])

    const tableMatrixSet = (row) => {
      const positionArray = [];

      if(payments?.distributedAmounts[row]) {

        positionArray.push(Number(getPaymentMatrixSet(row, 'buyer')))
        positionArray.push(Number(getPaymentMatrixSet(row, 'escrow')))
        positionArray.push(Number(getPaymentMatrixSet(row, 'seller')))
      }
      
      return positionArray
    }
    // voucherDetails?.sellerDeposit
    const tablePositions = {}

    tablePositions.price = tableMatrixSet('payment')
    tablePositions.buyerDeposit = tableMatrixSet('buyerDeposit')
    tablePositions.sellerDeposit = tableMatrixSet('sellerDeposit')


    // this is to check if the block should be positioned in the escrow column
    Object.entries(tablePositions)?.forEach(entry =>  tablePositions[entry[0]][1] = entry[1].length ? (entry[1]?.reduce((acc, val) => acc + val) ? tablePositions[entry[0]][1] : voucherDetails[entry[0]]) : 0) // only god can judge me

    return (
      {
        PAYMENT: {
            title: 'PAYMENT',
            currency: voucherDetails?.currency,
            position: tablePositions.price,
        },
        BUYER_DEPOSIT: {
            title: 'BUYER DEPOSIT',
            currency: voucherDetails?.currency,
            position: tablePositions.buyerDeposit,
        },
        SELLER_DEPOSIT: {
            title: 'SELLER DEPOSIT',
            currency: voucherDetails?.currency,
            position: tablePositions.sellerDeposit,
        },
      }
    )
}

async function getPayments(voucherDetails, account, modalContext) {
    if (!account) {
        modalContext.dispatch(ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content: 'Please connect your wallet account'
        }));
        return;
    }

    const authData = getAccountStoredInLocalStorage(account);

    try {
        return await getPaymentsDetails(voucherDetails.id, authData.authToken);
    } catch (e) {
        modalContext.dispatch(ModalResolver.showModal({
            show: true,
            type: MODAL_TYPES.GENERIC_ERROR,
            content: e.message
        }));
    }
}

export async function onCommitToBuy(props) {
    const { history, modalContext, library, account, setLoading, voucherSetDetails, bosonRouterContract } = props

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
    console.log("pricecalc", price, voucherSetInfo)
console.log(txValue)

    try {
        tx = await bosonRouterContract.requestVoucherETHETH(supplyId, voucherSetInfo.voucherOwner, {
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
    const { modalContext, library, account, setLoading, bosonRouterContract, voucherDetails, voucherId } = props

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
        tx = await bosonRouterContract.complain(voucherDetails._tokenIdVoucher);

        const receipt = await tx.wait();

        let encodedTopic = await getEncodedTopic(receipt, VOUCHER_KERNEL.abi, SMART_CONTRACTS_EVENTS.VoucherRedeemed);

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
    const { modalContext, library, account, setLoading, bosonRouterContract, voucherDetails, voucherId } = props

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
        tx = await bosonRouterContract.refund(voucherDetails._tokenIdVoucher);

        const receipt = await tx.wait();

        let encodedTopic = await getEncodedTopic(receipt, VOUCHER_KERNEL.abi, SMART_CONTRACTS_EVENTS.VoucherRedeemed);

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
    const { modalContext, library, account, setLoading, bosonRouterContract, voucherDetails, voucherId } = props

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
        console.log(authData)
        console.log(voucherDetails._tokenIdVoucher)
        tx = await bosonRouterContract.cancelOrFault(voucherDetails._tokenIdVoucher);

        const receipt = await tx.wait();

        let encodedTopic = await getEncodedTopic(receipt, VOUCHER_KERNEL.abi, SMART_CONTRACTS_EVENTS.VoucherRedeemed);

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
