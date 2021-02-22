/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from "react-router-dom";
import { useHistory } from "react-router"

import * as ethers from "ethers";
import { getVoucherDetails, getPaymentsDetails, updateVoucher, commitToBuy, cancelVoucherSet } from "../hooks/api";
import { useBosonRouterContract  } from "../hooks/useContract";
import { getEncodedTopic, decodeData } from "../hooks/useContract";
import { ModalResolver } from "../contexts/Modal";
import { formatDate } from "../helpers/Format"
import VOUCHER_KERNEL from "../hooks/ABIs/VoucherKernel";
import ContractInteractionButton from "../components/shared/ContractInteractionButton";
import PopupMessage from "../components/shared/PopupMessage";

import "./VoucherDetails.scss"

import { DateTable, TableRow, PriceTable, DescriptionBlock } from "../components/shared/TableContent"
import { HorizontalScrollView } from "rc-horizontal-scroll";

import EscrowDiagram from "../components/redemptionFlow/EscrowDiagram"

import { useWeb3React } from "@web3-react/core";
import { ROLE, OFFER_FLOW_SCENARIO, STATUS, ROUTE, MODAL_TYPES } from "../helpers/Dictionary";
import { ModalContext } from "../contexts/Modal";
import { GlobalContext } from "../contexts/Global";
import { NavigationContext, Action } from "../contexts/Navigation";
import Loading from "../components/offerFlow/Loading";

import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { initVoucherDetails } from "../helpers/VoucherParsers"

import { SMART_CONTRACTS_EVENTS, VOUCHER_STATUSES } from "../hooks/configs";


function VoucherDetails(props) {
    const [voucherDetails, setVoucherDetails] = useState(null)
    const [escrowData, setEscrowData] = useState(null)
    const voucherId = props.match.params.id;
    const modalContext = useContext(ModalContext);
    const globalContext = useContext(GlobalContext);
    const navigationContext = useContext(NavigationContext);
    const expiryProgressBar = useRef()
    const [loading, setLoading] = useState(0);
    const bosonRouterContract = useBosonRouterContract();
    const { library, account } = useWeb3React();
    const history = useHistory()
    const [voucherStatus, setVoucherStatus] = useState();
    // const cashierContract = useCashierContract();
    const [controls, setControls] = useState();
    const [actionPerformed, setActionPerformed] = useState(1);
    const [popupMessage, setPopupMessage] = useState();
    const voucherSets = globalContext.state.allVoucherSets

    const voucherSetDetails = voucherSets.find(set => set.id === voucherId)

    const convertToDays = (date) => parseInt((date.getTime()) / (60 * 60 * 24 * 1000))

    let today = new Date()
    let start = new Date(voucherDetails?.startDate)
    let end = new Date(voucherDetails?.expiryDate)

    const timePast = voucherDetails && (today?.getTime() / 1000) - (start?.getTime() / 1000)
    const timeAvailable = voucherDetails && (end?.getTime() / 1000) - (start?.getTime() / 1000)

    const differenceInPercent = (x, y) => (x / y) * 100
    const expiryProgress = voucherDetails && differenceInPercent(timePast, timeAvailable) + '%';


    const daysPast = voucherDetails && convertToDays(new Date()) - convertToDays(new Date(voucherDetails.startDate)) + 1
    const daysAvailable = voucherDetails && convertToDays(new Date(voucherDetails.expiryDate)) - convertToDays(new Date(voucherDetails.startDate)) + 1

    const getProp = prop => voucherSetDetails ? voucherSetDetails[prop] : (voucherDetails ? voucherDetails[prop] : null)

    // int on index #2 is the X position of the block
    const tablePrices = [
        ['Payment Price', getProp('price'), 'ETH', 0],
        false,
        ['Buyer’s deposit', getProp('deposit'), 'ETH', 1],
        ['Seller’s deposit', getProp('sellerDeposit'), 'ETH', 1]
    ];

    const tableDate = [
        formatDate(getProp('startDate')),
        formatDate(getProp('expiryDate'))
    ];

    const tableCategory = [
        ['Category', getProp('category')],
        // ['Remaining Quantity', selectedProduct?.qty],
    ];

    const confirmAction = (action) => {
        const callAction = () => {
            action()
            setPopupMessage(false)
        }
        setPopupMessage({
            text: 'Are you sure you want to cancel the voucher set?', 
            controls: <div className="flex split buttons-pair"><div className="button gray" role="button" onClick={ () => setPopupMessage(false)}>BACK</div><div className="button primary" role="button" onClick={ () => callAction()}>CANCEL</div></div>,
        })
    }

    // assign controlset to statuses
    const controlList = () => {
        const CASE = {}
    
        CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.COMMITED]] =
        CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.REFUNDED]] =
        CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.COMPLAINED]] =
        CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.REDEEMED]] = () => (
        <div className="button gray" onClick={ () => onCoF} role="button">Cancel or fault</div>
        )
    
        CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.COMMITED]] = () => (
        <div className="flex dual split">
            <div className="button refund" role="button" onClick={ () => onRefund()}>REFUND</div>
            <Link
            to={ `${ ROUTE.VoucherDetails }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
            <div className="button primary" role="button">REDEEM</div>
            </Link>
        </div>
        )
    
        CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REDEEMED]] =
        CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.CANCELLED]] =
        CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REFUNDED]] = () => (
        <div className="button red" role="button" onClick={ () => onComplain()}>COMPLAIN</div>
        )
    
        CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.OFFERED]] = 
        CASE[OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.OFFERED]] = () => (
        <ContractInteractionButton
            className="button primary"
            handleClick={ () => onCommitToBuy() }
            label={`COMMIT TO BUY ${voucherSetDetails?.price}`}
        />
        )
    
        return CASE
    }

    const determineStatus = () => {    
        const voucherResource = voucherDetails ? voucherDetails : (voucherSetDetails ? voucherSetDetails : false)
    
        const voucherRoles = {
        owner: voucherResource?.voucherOwner?.toLowerCase() === account?.toLowerCase(),
        holder: voucherResource?.holder?.toLowerCase() === account?.toLowerCase(),
        }
    
        const statusPropagate = () => (
        voucherResource.FINALIZED ? STATUS.FINALIZED:
        voucherResource.CANCELLED ? 
            (!voucherResource.COMPLAINED ? STATUS.CANCELLED : STATUS.COMPLANED_CANCELED):
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
            voucherSetDetails?.qty <= 0, // no quantity
        ]
    
        // status: undefined - user that has not logged in
        return !blockActionConditions.includes(true) ? OFFER_FLOW_SCENARIO[role][status] : undefined
    }
  
    const getControlState = () => {
        const controlResponse = controlList()
    
        return voucherStatus ?
            controlResponse[voucherStatus] && controlResponse[voucherStatus]()
            : null
    }

    const statusBlocks = voucherDetails ? [ ] : false

    if(!!voucherDetails) {
        if(voucherDetails.COMMITTED) statusBlocks.push({ title: 'COMMITTED', date: voucherDetails.COMMITTED })
        if(voucherDetails.REDEEMED) statusBlocks.push({ title: 'REDEEMED', date: voucherDetails.REDEEMED })
        if(voucherDetails.REFUNDED) statusBlocks.push({ title: 'REFUNDED', date: voucherDetails.REFUNDED })
        if(voucherDetails.COMPLAINED) statusBlocks.push({ title: 'COMPLAINED', date: voucherDetails.COMPLAINED })
        if(voucherDetails.CANCELLED) statusBlocks.push({ title: 'CANCELLED', date: voucherDetails.CANCELLED })
        if(voucherDetails.FINALIZED) statusBlocks.push({ title: 'FINALIZED', date: voucherDetails.FINALIZED })

        statusBlocks[statusBlocks.length -1].color = 2
        if(statusBlocks.length === 1) statusBlocks[0].color = 1
    }
  
    const prepareEscrowData = async () => {
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
  
    async function getPayments() {
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

    async function onCommitToBuy() {

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
            await commitToBuy(voucherSetInfo.id, metadata, authData.authToken);
    
            history.push(ROUTE.ActivityVouchers)
        } catch (e) {
            setLoading(0);
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
        }
    
        setActionPerformed(actionPerformed * -1)
        setLoading(0)
    }

    async function onComplain() {

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
    
            await tx.wait();
    
          
    
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
    
            await updateVoucher(data, authData.authToken);
        } catch (e) {
            setLoading(0);
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message + ' :252'
            }));
        }
    
        setActionPerformed(actionPerformed * -1)
        setLoading(0)
    }

    async function onRefund() {

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
    
            await tx.wait();
    
    
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
    
            await updateVoucher(data, authData.authToken);
        } catch (e) {
            setLoading(0);
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message + ' :252'
            }));
        }
    
        setActionPerformed(actionPerformed * -1)
        setLoading(0)
    }

    async function onCoF() {

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
            tx = await bosonRouterContract.cancelOrFault(voucherDetails._tokenIdVoucher);
    
          await tx.wait();
    
           
    
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
    
            await updateVoucher(data, authData.authToken);
        } catch (e) {
            setLoading(0);
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message + ' :252'
            }));
        }
    
        setActionPerformed(actionPerformed * -1)
        setLoading(0)
    }

    useEffect(() => {
        setVoucherStatus(determineStatus())

    }, [voucherDetails, account])

    useEffect(() => {
        if(voucherDetails) setEscrowData(prepareEscrowData())
        setControls(getControlState())

    }, [voucherStatus, voucherDetails])

    useEffect(() => {
        if (document.documentElement)
            document.documentElement.style.setProperty('--progress-percentage', expiryProgress ? parseInt(expiryProgress.split('%')[0]) > 100 ? '100%' : expiryProgress : null);

    }, [expiryProgress])

    useEffect(() => {
        if(!voucherSetDetails && account) {
            initVoucherDetails(account, modalContext, getVoucherDetails, voucherId).then(result => {
                setVoucherDetails(result)
            })
        }
    }, [account, actionPerformed])

    useEffect(() => {
        navigationContext.dispatch(Action.setRedemptionControl({
            controls: controls
        }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [controls])

    const onCancelOrFaultVoucherSet = async () => {

        try{
             const tx = await bosonRouterContract.requestCancelOrFaultVoucherSet(voucherSetDetails._tokenIdSupply);
             setLoading(1);
             await tx.wait();
     
         } catch (e) {
            
             modalContext.dispatch(ModalResolver.showModal({
                 show: true,
                 type: MODAL_TYPES.GENERIC_ERROR,
                 content: e.message
             }));
             return;
         }
    
         const authData = getAccountStoredInLocalStorage(account);
     
         try {

             await cancelVoucherSet(voucherSetDetails._tokenIdSupply, {}, authData.authToken)
      
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
    return (
        <>
            { loading ? <Loading/> : null }
            { <PopupMessage {...popupMessage} /> }
            <section className="voucher-details no-bg">
                <div className="container erase">
                    <div className="content">
                        <div className="section title">
                            <h1>{ getProp('title') }</h1>
                        </div>
                        {!voucherSetDetails && voucherStatus?.split(':')[0] !== ROLE.NON_BUYER_SELLER && statusBlocks ?
                            <div className="section status">
                            <h2>Status</h2>
                            <div className="status-container flex">
                            <HorizontalScrollView
                                items={statusBlocks}
                                ItemComponent={statusBlockComponent}
                                defaultSpace='0'
                                spaceBetweenItems='8px'
                                moveSpeed={1}
                            />
                            </div>
                        </div>
                        :null}
                        {!voucherSetDetails && voucherStatus?.split(':')[0] !== ROLE.NON_BUYER_SELLER ?
                        <div className="section expiration">
                            <div className="expiration-container flex split">
                                <p>Expiration Time</p>
                                <div className="time-left flex column center">
                                    <p>{daysAvailable - daysPast > 0 ? `${daysAvailable - daysPast} DAY${daysAvailable - daysPast > 1 ? 'S' : ''} LEFT` : 'EXPIRED'}</p>
                                    <div ref={ expiryProgressBar } className="progress"></div>
                                </div>
                            </div>
                        </div>
                        :null}
                        {!voucherSetDetails && voucherStatus?.split(':')[0] !== ROLE.NON_BUYER_SELLER ?
                            <div className="section escrow">
                            {escrowData ?
                                <EscrowDiagram escrowData={ escrowData } />
                            :null}
                            </div>
                        :null}
                        <div className="section info">
                            <div className="section description">
                            <div className="thumbnail flex center">
                                <img className="mw100" src={ getProp('image') } alt={ getProp('image') }/>
                            </div>
                                {<DescriptionBlock voucherSetDetails={voucherSetDetails} getProp={getProp} />}
                            </div>
                            <div className="section category">
                            </div>
                            <div className="section general">
                                {/* { tableLocation ? <TableLocation data={ tableLocation }/> : null } */}
                                { getProp('category') ? <TableRow data={ tableCategory }/> : null }   
                            </div>
                            {voucherSetDetails ?
                            <div className="section price">
                                { tablePrices.some(item => item) ? <PriceTable data={ tablePrices }/> : null }
                            </div>
                            :null}
                            <div className="section date">
                                { tableDate.some(item => item) ? <DateTable data={ tableDate }/> : null }
                            </div>
                        </div>
                    </div>

                    {
                        voucherSetDetails && voucherSetDetails?.qty > 0 && account?.toLowerCase() === voucherSetDetails.voucherOwner.toLowerCase() ? 
                        <div className="button cancelVoucherSet" onClick={ () => confirmAction(onCancelOrFaultVoucherSet)} role="button">CANCEL VOUCHER SET</div>
                         : null
                    }
                </div>
            </section>
        </>
    )
}

function statusBlockComponent({ item, index }) {
    return (
        <div key={index} className={`status-block color_${ item.color }`}>
            <h3 className="status-name">{item.title}</h3>
            <p className="status-details">{formatDate(item.date, 'string')}</p>
        </div>
    );
}

export default VoucherDetails
