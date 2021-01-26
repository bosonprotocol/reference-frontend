import React, { useEffect, useState, useContext, useRef } from 'react';

import { useHistory } from "react-router"

import { getVoucherDetails, updateVoucher } from "../hooks/api";
import { formatDate } from "../helpers/Format"

import "./VoucherDetails.scss"

import { DateTable, TableLocation, TableRow } from "../components/shared/TableContent"
import { getEncodedTopic, useVoucherKernelContract } from "../hooks/useContract";
import VOUCHER_KERNEL from "../hooks/ABIs/VoucherKernel";
import { SMART_CONTRACTS_EVENTS, VOUCHER_STATUSES } from "../hooks/configs";

import EscrowDiagram from "../components/redemptionFlow/EscrowDiagram"

import { Arrow } from "../components/shared/Icons"
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";
import { MODAL_TYPES, ROUTE, STATUS } from "../helpers/Dictionary";
import { ModalContext, ModalResolver } from "../contexts/Modal";
import { GlobalContext } from "../contexts/Global";
import Loading from "../components/offerFlow/Loading";

import { prepareVoucherDetails } from "../helpers/VoucherParsers"

const escrowPositionMapping = {
    [STATUS.HOLDER_REDEEMED]: {
        PAYMENT: 2,
        BUYER_DEPOSIT: 2,
        SELLER_DEPOSIT: 2,
    },
    [STATUS.HOLDER_COMMITED]: {
        PAYMENT: 2,
        BUYER_DEPOSIT: 2,
        SELLER_DEPOSIT: 2,
    },
    [STATUS.DEFAULT]: {
        PAYMENT: 1,
        BUYER_DEPOSIT: 2,
        SELLER_DEPOSIT: 3,
    },
}

function VoucherDetails(props) {
    const [voucherDetails, setVoucherDetails] = useState(null)
    const [escrowData, setEscrowData] = useState(null)
    const voucherId = props.match.params.id;
    const modalContext = useContext(ModalContext);
    const globalContext = useContext(GlobalContext);
    const expiryProgressBar = useRef()
    const [loading, setLoading] = useState(0);
    const voucherKernelContract = useVoucherKernelContract();
    const { library, account } = useWeb3React();
    const history = useHistory()
    const [voucherStatus, setVoucherStatus] = useState();

    const voucherSets = globalContext.state.allVoucherSets

    const instanceOfSet = voucherSets.find(set => set.id === voucherId)

    const convertToDays = (date) => parseInt((date.getTime()) / (60 * 60 * 24 * 1000))

    const daysPast = voucherDetails && convertToDays(new Date()) - convertToDays(new Date(voucherDetails.startDate)) + 1
    const daysAvailable = voucherDetails && convertToDays(new Date(voucherDetails.expiryDate)) - convertToDays(new Date(voucherDetails.startDate)) + 1

    const differenceInPercent = (x, y) => (x / y) * 100
    const expiryProgress = voucherDetails && differenceInPercent(daysPast, daysAvailable) + '%';

    const statusColor = 1

    const sharedProps = { modalContext, library, account, setLoading, voucherKernelContract, voucherDetails, voucherId, voucherStatus }

    useEffect(() => {
        setVoucherStatus(determineStatus(sharedProps))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voucherDetails, account])

    useEffect(() => {
        (voucherDetails && voucherStatus !== STATUS.PUBLIC_NOT_OWNER) && setEscrowData(prepareEscrowData(sharedProps))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voucherStatus, voucherDetails])

    useEffect(() => {
        if (document.documentElement && voucherStatus !== STATUS.PUBLIC_NOT_OWNER)
            document.documentElement.style.setProperty('--progress-percentage', expiryProgress);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expiryProgress])

    useEffect(() => {
        async function initVoucherDetails() {
            if (!account) {
                return;
            }

            const authData = getAccountStoredInLocalStorage(account);

            if (!authData.activeToken) {
                modalContext.dispatch(ModalResolver.showModal({
                    show: true,
                    type: MODAL_TYPES.GENERIC_ERROR,
                    content: 'Please check your wallet for Signature Request. Once authentication message is signed you can proceed '
                }));
                return;
            }

            const rawVoucherDetails = await getVoucherDetails(voucherId, authData.authToken);
            const parsedVoucher = prepareVoucherDetails(rawVoucherDetails.voucher);

            if(parsedVoucher) {
                setVoucherDetails(parsedVoucher)
            }
        }

        voucherStatus !== STATUS.PUBLIC_NOT_OWNER && initVoucherDetails()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])
  
    const tableSellerInfo = [
        ['Seller', 'David'],
        ['Phone', '1-415-542-5050'],
    ];

    const tableDate = [
        formatDate(voucherDetails?.startDate),
        formatDate(voucherDetails?.expiryDate)
    ];

    const tableLocation = 'Los Angeles'

    const controls = getControlState(sharedProps)

    return (
        <>
            { loading ? <Loading/> : null }
            <section className="voucher-details no-bg">
                <div className="container erase">
                    <div className="button square new" role="button"
                         onClick={ () => history.goBack() }
                    >
                        <Arrow color="#80F0BE"/>
                    </div>
                    <div className="content">
                        <div className="section title">
                            <h1>{ voucherDetails?.title }</h1>
                        </div>
                        {!instanceOfSet ?
                            <div className="section status">
                            <h2>Status</h2>
                            <div className="status-container flex">
                                <div className={ `status-block color_${ statusColor }` }>
                                    <h3 className="status-name">COMMITED</h3>
                                    <p className="status-details">{ formatDate(voucherDetails?.commitedDate, 'string') }</p>
                                </div>
                            </div>
                        </div>
                        :null}
                        {!instanceOfSet ?
                        <div className="section expiration">
                            <div className="expiration-container flex split">
                                <p>Expiration Time</p>
                                <div className="time-left flex column center">
                                    <p>{ daysAvailable - daysPast } DAY{ daysAvailable - daysPast > 1 ? 'S' : null } LEFT</p>
                                    <div ref={ expiryProgressBar } className="progress"></div>
                                </div>
                            </div>
                        </div>
                        :null}
                        {!instanceOfSet ?
                            <div className="section escrow">
                            {escrowData ?
                                <EscrowDiagram escrowData={ escrowData } />
                            :null}
                            </div>
                        :null}
                        <div className="section info">
                            <div className="section description">
                                <h2 className="flex split">
                                    <span>Description</span>
                                    <div className="image flex center">
                                        <img src={ voucherDetails?.image } alt={ voucherDetails?.title }/>
                                    </div>
                                </h2>
                                <div className="description">
                                    { voucherDetails?.description }
                                </div>
                            </div>
                            <div className="section general">
                                { tableLocation ? <TableLocation data={ tableLocation }/> : null }
                                { voucherDetails?.category.some(item => item) ?
                                    <TableRow data={ voucherDetails?.category }/> : null }
                            </div>
                            <div className="section date">
                                { tableDate.some(item => item) ? <DateTable data={ tableDate }/> : null }
                            </div>
                            {!instanceOfSet ?
                                <div className="section seller">
                                { tableSellerInfo.some(item => item) ? <TableRow data={ tableSellerInfo }/> : null }
                            </div>
                            :null}
                        </div>
                    </div> 
                    <div className="control-wrap">
                    {controls}
                    </div>
                </div>
            </section>
        </>
    )
}

const prepareEscrowData = (sharedProps) => {
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

const determineStatus = (sharedProps) => {
    const { account, voucherDetails } = sharedProps

    // technical information about the voucher
    const VouherStatus = {
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
        VouherStatus.owner = isOwner(voucher)
        VouherStatus.holder = isHolder(voucher)
        VouherStatus.commited = isCommited(voucher)
        VouherStatus.redeemed = isRedeemed(voucher)
        VouherStatus.complained = isComplained(voucher)
    }

    // run checks
    updateVoucherStatus(voucherDetails)

    // perform a check on the current voucher and return relevant status
    if(VouherStatus.owner && VouherStatus.commited && !VouherStatus.redeemed) return STATUS.OWNER_GENERAL
    if(VouherStatus.holder && VouherStatus.commited && !VouherStatus.redeemed) return STATUS.HOLDER_COMMITED
    if(VouherStatus.holder && VouherStatus.commited && VouherStatus.redeemed && !VouherStatus.complained) return STATUS.HOLDER_REDEEMED
    return STATUS.DEFAULT
}

const getControlState = (sharedProps) => {
    const { voucherDetails} = sharedProps

    const voucherStatus = determineStatus(sharedProps)

    // assign controlset to statuses
    const controlList = {
        [STATUS.OWNER_GENERAL]: () => (
            < div className="button gray" disabled role="button">Cancel or fault</div>
        ),
        [STATUS.HOLDER_COMMITED]: () => (
            <Link
                to={ `${ ROUTE.VoucherDetails }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
                <div className="button primary" role="button">REDEEM</div>
            </Link>
        ),
        [STATUS.HOLDER_REDEEMED]: () => (
            < div className="button red" role="button" onClick={ () => onComplain(sharedProps)}>COMPLAIN</div>
        ),
        [STATUS.DEFAULT]: () => (
            < div className="button gray" role="button" onClick={ () => onComplain(sharedProps)}>WAITING</div>
        ),
    }

    return voucherStatus ? 
        controlList[voucherStatus]()
    : null
}

async function onComplain(props) {
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
        console.log(complainResponse);
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

export default VoucherDetails
