import React, { useEffect, useState, useContext, useRef } from 'react';

import { useHistory } from "react-router"
import { useCashierContract } from "../hooks/useContract";


import { getVoucherDetails } from "../hooks/api";
import { useVoucherKernelContract } from "../hooks/useContract";
import { formatDate } from "../helpers/Format"

import "./VoucherDetails.scss"

import { DateTable, TableRow, PriceTable, DescriptionBlock } from "../components/shared/TableContent"
import { HorizontalScrollView } from "rc-horizontal-scroll";

import EscrowDiagram from "../components/redemptionFlow/EscrowDiagram"

import { Arrow } from "../components/shared/Icons"
import { useWeb3React } from "@web3-react/core";
import { ROLE } from "../helpers/Dictionary";
import { ModalContext } from "../contexts/Modal";
import { GlobalContext } from "../contexts/Global";
import Loading from "../components/offerFlow/Loading";

import { initVoucherDetails } from "../helpers/VoucherParsers"

import { prepareEscrowData, determineStatus, getControlState } from "../helpers/VoucherDetailsHelper"

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
    const cashierContract = useCashierContract();

    const voucherSets = globalContext.state.allVoucherSets

    const voucherSetDetails = voucherSets.find(set => set.id === voucherId)

    const convertToDays = (date) => parseInt((date.getTime()) / (60 * 60 * 24 * 1000))

    const daysPast = voucherDetails && convertToDays(new Date()) - convertToDays(new Date(voucherDetails.startDate)) + 1
    const daysAvailable = voucherDetails && convertToDays(new Date(voucherDetails.expiryDate)) - convertToDays(new Date(voucherDetails.startDate)) + 1

    const differenceInPercent = (x, y) => (x / y) * 100
    const expiryProgress = voucherDetails && differenceInPercent(daysPast, daysAvailable) + '%';

    const getProp = prop => voucherSetDetails ? voucherSetDetails[prop] : (voucherDetails ? voucherDetails[prop] : null)

    // properties that are shared between functions which affect this component
    const sharedProps = { voucherSetDetails, history, cashierContract, modalContext, library, account, setLoading, voucherKernelContract, voucherDetails, voucherId, voucherStatus }

    useEffect(() => {
        setVoucherStatus(determineStatus(sharedProps))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voucherDetails, account])

    useEffect(() => {
        (voucherDetails) && setEscrowData(prepareEscrowData(sharedProps))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voucherStatus, voucherDetails])

    useEffect(() => {
        if (document.documentElement)
            document.documentElement.style.setProperty('--progress-percentage', expiryProgress ? parseInt(expiryProgress.split('%')[0]) > 100 ? '100%' : expiryProgress : null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expiryProgress])

    useEffect(() => {
        if(!voucherSetDetails && account) {
            initVoucherDetails(account, modalContext, getVoucherDetails, voucherId).then(result => {
                setVoucherDetails(result)
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])
  
    const tableSellerInfo = [
        ['Seller', 'David'],
        ['Phone', '1-415-542-5050'],
    ];

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

    // const tableLocation = 'Los Angeles'

    const controls = getControlState(sharedProps)

    const statusBlocks = voucherDetails ? [ ] : false

    if(!!voucherDetails) {
        if(voucherDetails.COMMITTED) statusBlocks.push({ title: 'COMMITTED', date: voucherDetails.COMMITTED })
        if(voucherDetails.REDEEMED) statusBlocks.push({ title: 'REDEEMED', date: voucherDetails.REDEEMED })
        if(voucherDetails.COMPLAINED) statusBlocks.push({ title: 'COMPLAINED', date: voucherDetails.COMPLAINED })
        if(voucherDetails.REFUNDED) statusBlocks.push({ title: 'REFUNDED', date: voucherDetails.REFUNDED })
        if(voucherDetails.CANCELLED) statusBlocks.push({ title: 'CANCELLED', date: voucherDetails.CANCELLED })
        if(voucherDetails.FINALIZED) statusBlocks.push({ title: 'FINALIZED', date: voucherDetails.FINALIZED })

        statusBlocks[statusBlocks.length -1].color = 2
        if(statusBlocks.length === 1) statusBlocks[0].color = 1
    }
    
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
                            {!voucherSetDetails ?
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

function statusBlockComponent({ item, index }) {
    console.log(item, index)
    return (
        <div key={index} className={`status-block color_${ item.color }`}>
            <h3 className="status-name">{item.title}</h3>
            <p className="status-details">{formatDate(item.date, 'string')}</p>
        </div>
    );
  }

export default VoucherDetails
