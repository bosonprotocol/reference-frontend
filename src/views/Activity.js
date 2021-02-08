import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import "./Activity.scss"

import { GlobalContext } from '../contexts/Global'

import { ROUTE } from "../helpers/Dictionary"

import { Quantity } from "../components/shared/Icons"

import { getAccountVouchers, initVoucherDetails } from "../helpers/VoucherParsers"
import { ModalContext } from "../contexts/Modal";
import { useWeb3React } from "@web3-react/core";
import { getVoucherDetails } from "../hooks/api";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { blockTypes, sortBlocks, ActiveTab, ChildVoucherBlock } from "../helpers/ActivityHelper"
import { useWeb3React } from "@web3-react/core";
import Loading from "../components/offerFlow/Loading";

export function ActivityAccountVouchers() {
    const [voucherBlocks, setVoucherBlocks] = useState([])
    const modalContext = useContext(ModalContext);
    const { account } = useWeb3React();
    const [loading, setLoading] = useState(0)

    useEffect(() => {
        let accountVouchers;

        setLoading(1);

        getAccountVouchers(account, modalContext).then(result => {
            setLoading(0);
            accountVouchers = result;
            accountVouchers ?
                setVoucherBlocks(accountVouchers)
                : setVoucherBlocks([])
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return voucherBlocks.length ?
        <ActivityView voucherBlocks={ voucherBlocks } blockType={ blockTypes.account }/> : loading ? <Loading/> : null
}

export function ActivityVoucherSets() {
    const [voucherBlocks, setVoucherBlocks] = useState([])
    const globalContext = useContext(GlobalContext);

    const voucherSets = globalContext.state.allVoucherSets

    useEffect(() => {
        voucherSets ?
            setVoucherBlocks(voucherSets)
            : setVoucherBlocks([])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voucherSets])

    return voucherBlocks.length ?
        <ActivityView voucherBlocks={ voucherBlocks } blockType={ blockTypes.voucherSet }/> : null
}

function ActivityView(props) {
    const { voucherBlocks, blockType } = props

    const blocksSorted = sortBlocks(voucherBlocks)

    const activeVouchers = blocksSorted.active
    const inactiveVouchers = blocksSorted.inactive

    return (
        <>
            <section className="activity atomic-scoped">
                <div className="container">
                    <div className="top-navigation flex split">
                        <div className="button square dark" role="button"
                             onClick={ () => history.goBack() }
                        >
                            <Arrow color="#80F0BE"/>
                        </div>
                        <Link to={ ROUTE.CodeScanner }>
                            <div className="qr-icon" role="button"><IconQR color="#8393A6" noBorder/></div>
                        </Link>
                    </div>
                    <div className="page-title">
                        <h1>{ blockType === blockTypes.account ? 'Activity' : 'Voucher Sets' }</h1>
                    </div>
                    <Tabs>
                        <TabList>
                            <Tab>Active</Tab>
                            <Tab>Inactive</Tab>
                        </TabList>

                        <TabPanel>
                            { <ActiveTab blockType={ blockType } products={ activeVouchers }/> }
                        </TabPanel>
                        <TabPanel>
                            { <ActiveTab blockType={ blockType } products={ inactiveVouchers }/> }
                        </TabPanel>
                    </Tabs>

                </div>
            </section>
        </>
    )
}

export const VoucherSetBlock = (props) => {
    const [expand, setExpand] = useState(-1)
    const [matchingVouchers, setMatchingVouchers] = useState([])
    const { title, image, price, qty, currency, _id } = props //id
    const globalContext = useContext(GlobalContext);

    useEffect(() => {
        if (globalContext.state.allVoucherSets) setMatchingVouchers(globalContext.state.allVoucherSets.filter(voucher => voucher.id === _id))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={ `collapsible state_${ expand > 0 ? 'opened' : 'collapsed' }` }>
            <div className="voucher-block solo flex relative" onClick={ () => setExpand(expand * -1) }>
                <div className="thumb no-shrink">
                    <img src={ image } alt={ title }/>
                </div>
                <div className="info grow flex column jc-sb">
                    <div className="title-container">
                        <div className="status">
                            <p>VOUCHER SET</p>
                        </div>
                        <div className="title elipsis">{ title }</div>
                    </div>
                    <div className="price flex split">
                        <div className="value flex center"><img src="images/icon-eth.png"
                                                                alt="eth"/> { price } { currency }
                        </div>
                        <div className="quantity"><span className="icon"><Quantity/></span> QTY: { qty }</div>
                    </div>
                </div>
            </div>
            <div className="child-vouchers">
                { matchingVouchers ? matchingVouchers.map(voucher => <ChildVoucherBlock key={ voucher.id }
                                                                                        id={ voucher.id }
                                                                                        title={ voucher.title }
                                                                                        expiration={ 2 }/>) : null }
            </div>
        </div>
    )
}

export const SingleVoucherBlock = (props) => {
    const { title, image, price, currency, id } = props

    const globalContext = useContext(GlobalContext);
    const modalContext = useContext(ModalContext);
    const [voucherData, setVoucherData] = useState()

    useEffect(() => {
        initVoucherDetails(globalContext.state.account, modalContext, getVoucherDetails, id).then(result => {
            setVoucherData(result)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="voucher-block flex">
            <Link to={ `${ ROUTE.VoucherSetDetails }/${ id }` }>
                <div className="thumb no-shrink">
                    <img src={ image } alt={ title }/>
                </div>
                <div className="info grow flex jc-sb column">
                    <div className="title-container">
                        <div className="status">
                            <p>VOUCHER</p>
                        </div>
                        <div className="title elipsis">{ title }</div>
                    </div>
                    <div className="price flex split">
                        <div className="value flex center"><img src="images/icon-eth.png"
                                                                alt="eth"/> { price } { currency }
                        </div>
                    </div>
                </div>
                <div className="statuses">
                    { voucherData?.FINALIZED ? <div className="label color_FINALIZED">FINALIZED</div> : null }
                    { voucherData ? new Date() > new Date(voucherData.expiryDate) ?
                        <div className="label color_EXPIRED">EXPIRED</div> : null : null }
                    { voucherData?.CANCELLED ? <div className="label color_CANCELLED">CANCELLED</div> : null }
                    { voucherData?.COMMITTED ? <div className="label color_COMMITTED">COMMITTED</div> : null }
                    { voucherData?.COMPLAINED ? <div className="label color_COMPLAINED">COMPLAINED</div> : null }
                    { voucherData?.REDEEMED ? <div className="label color_REDEEMED">REDEEMED</div> : null }
                    { voucherData?.REFUNDED ? <div className="label color_REFUNDED">REFUNDED</div> : null }
                </div>
            </Link>
        </div>
    )
}


