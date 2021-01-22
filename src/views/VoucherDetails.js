import React, { useEffect, useState, useContext } from 'react'

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
import { MODAL_TYPES, ROUTE } from "../helpers/Dictionary";
import { ModalContext, ModalResolver } from "../contexts/Modal";

function VoucherDetails(props) {
    const [voucherDetails, setVoucherDetails] = useState(null)
    const [escrowData, setEscrowData] = useState(null)
    const voucherId = props.match.params.id;
    const { account } = useWeb3React();
    const modalContext = useContext(ModalContext);

    const history = useHistory()

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
        console.log(rawVoucher);

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
            REFUNDED: rawVoucher.REFUNDED
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
                            <div className="status"></div>
                        </div>
                        <div className="section expiration">
                            <div className="expiration"></div>
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
                    {/*ToDo: Demo implementation should be implemented better*/ }
                    <div className="control-wrap">
                        { account?.toLowerCase() === voucherDetails?.voucherOwner.toLowerCase()
                        && voucherDetails?.COMMITTED !== null && voucherDetails?.REDEEMED === null ?
                            < div className="button gray" disabled role="button">Cancel or fault</div>
                            : account?.toLowerCase() === voucherDetails?.holder.toLowerCase() && voucherDetails?.REDEEMED === null ?
                                <Link
                                    to={ `${ ROUTE.VoucherDetails }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
                                    <div className="button primary" role="button">REDEEM</div>
                                </Link> : null
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default VoucherDetails
