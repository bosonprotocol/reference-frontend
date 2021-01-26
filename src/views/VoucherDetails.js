import React, { useEffect, useState, useContext, useRef } from 'react';

import { useHistory } from "react-router"

import { getVoucherDetails } from "../hooks/api";
import { useVoucherKernelContract } from "../hooks/useContract";
import { formatDate } from "../helpers/Format"

import "./VoucherDetails.scss"

import { DateTable, TableLocation, TableRow } from "../components/shared/TableContent"

import EscrowDiagram from "../components/redemptionFlow/EscrowDiagram"

import { Arrow } from "../components/shared/Icons"
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { useWeb3React } from "@web3-react/core";
import { MODAL_TYPES, STATUS } from "../helpers/Dictionary";
import { ModalContext, ModalResolver } from "../contexts/Modal";
import { GlobalContext } from "../contexts/Global";
import Loading from "../components/offerFlow/Loading";

import { prepareVoucherDetails } from "../helpers/VoucherParsers"

import { prepareEscrowData, determineStatus, getControlState } from "../helpers/VoucherDetails"

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

    const PublicViewBool = voucherStatus === STATUS.PUBLIC_NOT_OWNER

    // properties that are shared between functions which affect this component
    const sharedProps = { modalContext, library, account, setLoading, voucherKernelContract, voucherDetails, voucherId, voucherStatus }

    useEffect(() => {
        setVoucherStatus(determineStatus(sharedProps))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voucherDetails, account])

    useEffect(() => {
        (voucherDetails && !PublicViewBool) && setEscrowData(prepareEscrowData(sharedProps))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voucherStatus, voucherDetails])

    useEffect(() => {
        if (document.documentElement && !PublicViewBool)
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

        !PublicViewBool && initVoucherDetails()

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

export default VoucherDetails
