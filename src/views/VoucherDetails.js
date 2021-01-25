import React, { useEffect, useState, useContext, useRef } from 'react';

import { useHistory } from "react-router"

import * as ethers from "ethers";
import { getVoucherDetails } from "../hooks/api";
import { formatDate } from "../helpers/Format"

import "./VoucherDetails.scss"

import { DateTable, TableLocation, TableRow } from "../components/shared/TableContent"

import EscrowDiagram from "../components/redemptionFlow/EscrowDiagram"

import { Arrow } from "../components/shared/Icons"
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";
import { MODAL_TYPES, ROUTE, STATUS } from "../helpers/Dictionary";
import { ModalContext, ModalResolver } from "../contexts/Modal";

function VoucherDetails(props) {
    const [voucherDetails, setVoucherDetails] = useState(null)
    const [escrowData, setEscrowData] = useState(null)
    const voucherId = props.match.params.id;
    const { account } = useWeb3React();
    const modalContext = useContext(ModalContext);
    const expiryProgressBar = useRef()

    const statusColor = 1

    const convertToDays = (date) => parseInt((date.getTime()) / (60 * 60 * 24 * 1000))

    const daysPast = voucherDetails && convertToDays(new Date()) - convertToDays(new Date(voucherDetails.startDate)) + 1
    const daysAvailable = voucherDetails && convertToDays(new Date(voucherDetails.expiryDate)) - convertToDays(new Date(voucherDetails.startDate)) + 1

    const differenceInPercent = (x, y) => (x / y) * 100

    const expiryProgress = voucherDetails && differenceInPercent(daysPast, daysAvailable) + '%';

    const history = useHistory()

    useEffect(() => {
        if (document.documentElement) document.documentElement.style.setProperty('--progress-percentage', expiryProgress);
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
            prepareVoucherDetails(rawVoucherDetails.voucher);
        }

        initVoucherDetails()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

    const prepareVoucherDetails = (rawVoucher) => {
        let parsedVoucher = {
            id: rawVoucher._id,
            title: rawVoucher.title,
            description: rawVoucher.description,
            //ToDo: Image should be get from voucher set
            // image: rawVoucher.imagefiles[0]?.url ? rawVoucher.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
            price: ethers.utils.formatEther(rawVoucher?.price.$numberDecimal),
            buyerDeposit: ethers.utils.formatEther(rawVoucher?.buyerDeposit.$numberDecimal),
            sellerDeposit: ethers.utils.formatEther(rawVoucher?.sellerDeposit.$numberDecimal),
            qty: rawVoucher.qty,
            startDate: rawVoucher.startDate,
            expiryDate: rawVoucher.expiryDate,
            category: [['Category', rawVoucher.category]],
            voucherOwner: rawVoucher.voucherOwner,
            holder: rawVoucher._holder,
            CANCELLED: rawVoucher.CANCELLED,
            COMMITTED: rawVoucher.COMMITTED,
            COMPLAINED: rawVoucher.COMPLAINED,
            FINALIZED: rawVoucher.FINALIZED,
            REDEEMED: rawVoucher.REDEEMED,
            REFUNDED: rawVoucher.REFUNDED,
            commitedDate: rawVoucher.COMMITTED,
        };

        console.log(parsedVoucher);

        setVoucherDetails(parsedVoucher)
        setEscrowData(prepareEscrowData(parsedVoucher));
    };

    const tableSellerInfo = [
        ['Seller', 'David'],
        ['Phone', '1-415-542-5050'],
    ];

    const tableDate = [
        formatDate(voucherDetails?.startDate),
        formatDate(voucherDetails?.expiryDate)
    ];

    const tableLocation = 'Los Angeles';

    const currency = 'ETH'

    //ToDo: Handle position based on voucher status and user role;
    //ToDo: Apply not only ETH version
    function prepareEscrowData(voucherDetails) {
        return {
            PAYMENT: {
                title: 'PAYMENT',
                value: `${ voucherDetails?.price } ${currency}`,
                position: 2,
            },
            BUYER_DEPOSIT: {
                title: 'BUYER DEPOSIT',
                value: `${ voucherDetails?.buyerDeposit } ${currency}`,
                position: 2,
            },
            SELLER_DEPOSIT: {
                title: 'SELLER DEPOSIT',
                value: `${ voucherDetails?.sellerDeposit } ${currency}`,
                position: 2,
            },
        }
    }

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

    // update the information about the voucher by running defined checks
    const updateVoucherStatus = (voucher) => {
        VouherStatus.owner = isOwner(voucher)
        VouherStatus.holder = isHolder(voucher)
        VouherStatus.commited = isCommited(voucher)
        VouherStatus.redeemed = isRedeemed(voucher)
    }

    // run checks
    updateVoucherStatus(voucherDetails)

    // perform a check on the current voucher and return relevant status
    const findRelevantControls = () => {
        if(VouherStatus.owner && VouherStatus.commited && !VouherStatus.redeemed) return STATUS.OWNER_CANCEL
        if(VouherStatus.holder && !VouherStatus.redeemed) return STATUS.HOLDER_REDEEM
    }

    const getRelevantControls = findRelevantControls()

    // assign controlset to statuses
    const controlList = {
        [STATUS.OWNER_CANCEL]: () => (
            < div className="button gray" disabled role="button">Cancel or fault</div>
        ),
        [STATUS.HOLDER_REDEEM]: () => (
            <Link
                to={ `${ ROUTE.VoucherDetails }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
                <div className="button primary" role="button">REDEEM</div>
            </Link>
        ),
    }

    return (
        <>
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
                        <div className="section status">
                            <h2>Status</h2>
                            <div className="status-container flex">
                                <div className={ `status-block color_${ statusColor }` }>
                                    <h3 className="status-name">COMMITED</h3>
                                    <p className="status-details">{ formatDate(voucherDetails?.commitedDate, 'string') }</p>
                                </div>
                            </div>
                        </div>
                        <div className="section expiration">
                            <div className="expiration-container flex split">
                                <p>Expiration Time</p>
                                <div className="time-left flex column center">
                                    <p>{ daysAvailable - daysPast } DAY{ daysAvailable - daysPast > 1 ? 'S' : null } LEFT</p>
                                    <div ref={ expiryProgressBar } className="progress"></div>
                                </div>
                            </div>
                        </div>
                        <div className="section escrow">
                            <EscrowDiagram escrowData={ escrowData } status={ 'commited' }/>
                        </div>
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
                            <div className="section seller">
                                { tableSellerInfo.some(item => item) ? <TableRow data={ tableSellerInfo }/> : null }
                            </div>
                        </div>
                    </div> 
                    <div className="control-wrap">
                    { getRelevantControls ? 
                        controlList[getRelevantControls]()
                    : null }
                    </div>
                </div>
            </section>
        </>
    )
}

export default VoucherDetails
