import React, { useEffect, useState, useRef } from 'react'

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
import { ROUTE } from "../helpers/Dictionary";

function VoucherDetails(props) {
    const [voucherDetails, setVoucherDetails] = useState(null)
    const [escrowData, setEscrowData] = useState(null)
    const voucherId = props.match.params.id;
    const { account } = useWeb3React();
    const expiryProgressBar = useRef()

    const statusColor = 1
    // very beautiful function that finds the difference between dates


    // const dateDiffernce = () =>
    // //  voucherDetails && (new Date(voucherDetails.startDate).getTime() / (60*60*24*1000))
    // voucherDetails && 
    // (
    //     (
    //         ((
    //             parseInt((
    //                 (new Date(voucherDetails.startDate).getTime()) /
    //                 (new Date(voucherDetails.expiryDate).getTime())
    //             ) / (60*60*24*1000)) + 1
    //         ) /
    //         (
    //             parseInt((
    //                 (new Date(voucherDetails.expiryDate).getTime())
    //             ) / (60*60*24*1000)) -
    //             parseInt((
    //                 (new Date(voucherDetails.startDate).getTime())
    //             ) / (60*60*24*1000))
    //         ))
    //         // * 100
    //     )
    // ) + '%'

    const convertToDays = (date) => parseInt((date.getTime()) / (60*60*24*1000)) 

    const daysPast = voucherDetails && convertToDays(new Date()) - convertToDays(new Date(voucherDetails.startDate))
    const daysAvailable = voucherDetails &&  convertToDays(new Date(voucherDetails.expiryDate)) - convertToDays(new Date(voucherDetails.startDate))

    const differenceInPercent = (x, y) => (x / y) * 100 === 100 ? 5 : (x / y) * 100

    console.log(100 - differenceInPercent(daysPast, daysAvailable))

    const expiryProgress = voucherDetails && 100 - differenceInPercent(daysPast, daysAvailable) + '%'
    

    const history = useHistory()

    useEffect(() => {
        if(document.documentElement) document.documentElement.style.setProperty('--progress-percentage', expiryProgress);
    }, [expiryProgress])

    useEffect(() => {
        async function initVoucherDetails() {
            if (!account) {
                return;
            }

            const authData = getAccountStoredInLocalStorage(account);
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
            commitedDate: rawVoucher.COMMITTED,
        };

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

    //ToDo: Handle position based on voucher status and user role;
    //ToDo: Apply not only ETH version
    function prepareEscrowData(voucherDetails) {
        return {
            PAYMENT: {
                title: 'PAYMENT',
                value: `${ voucherDetails?.price } ETH`,
                position: 2,
            },
            BUYER_DEPOSIT: {
                title: 'BUYER DEPOSIT',
                value: `${ voucherDetails?.buyerDeposit } ETH`,
                position: 2,
            },
            SELLER_DEPOSIT: {
                title: 'SELLER DEPOSIT',
                value: `${ voucherDetails?.sellerDeposit } ETH`,
                position: 2,
            },
        }
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
                                <div className={`status-block color_${statusColor}`}>
                                    <h3 className="status-name">COMMITED</h3>
                                    <p className="status-details">{formatDate(voucherDetails?.commitedDate, 'string')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="section expiration">
                            <div className="expiration-container flex split">
                                <p>Expiration Time</p>
                                <div className="time-left flex column center">
                                    <p>{daysAvailable - daysPast} DAY{daysAvailable - daysPast > 1 ? 'S' : null} LEFT</p>
                                    <div ref={expiryProgressBar} className="progress"></div>
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
                        <Link to={ `${ ROUTE.VoucherDetails }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
                            <div className="button primary" role="button">REDEEM</div>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default VoucherDetails
