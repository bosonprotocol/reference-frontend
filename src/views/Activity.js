
import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import "./Activity.scss"

import { GlobalContext } from '../contexts/Global'

import { ROUTE } from "../helpers/Dictionary"

import { Quantity, IconActivityMessage } from "../components/shared/Icons"

import { getAccountVouchers } from "../helpers/VoucherParsers"

import { ModalContext } from "../contexts/Modal";
import { useWeb3React } from "@web3-react/core";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { VOUCHER_TYPE, sortBlocks, ActiveTab, ChildVoucherBlock } from "../helpers/ActivityHelper"
import Loading from "../components/offerFlow/Loading";

import { WalletConnect } from "../components/modals/WalletConnect"

export function ActivityAccountVouchers() {
    const [accountVouchers, setAccountVouchers] = useState([])
    const { account } = useWeb3React();
    const modalContext = useContext(ModalContext);
    const globalContext = useContext(GlobalContext);
    const [loading, setLoading] = useState(0)
  
    useEffect(() => {
        setLoading(1);

        getAccountVouchers(account, modalContext).then(result => {
            setLoading(0);
            setAccountVouchers(result)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, globalContext.state.accountVouchers]);
    

    return <ActivityView loading={loading} voucherBlocks={ accountVouchers } account={account} voucherType={ VOUCHER_TYPE.accountVoucher}/>
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
        <ActivityView voucherBlocks={ voucherBlocks } voucherType={ VOUCHER_TYPE.voucherSet }/> : null
}

function ActivityView(props) {
    const { voucherBlocks, voucherType, loading, account } = props
    const globalContext = useContext(GlobalContext);

    const blocksSorted = sortBlocks(voucherBlocks, voucherType, globalContext)

    const activeVouchers = blocksSorted.active
    const inactiveVouchers = blocksSorted.inactive

    return (
        <>
        <section className="activity atomic-scoped">
            <div className="container">
                <div className="page-title">
                    <h1>{voucherType === VOUCHER_TYPE.accountVoucher ? 'Activity' : 'Voucher Sets'}</h1>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>{voucherType === VOUCHER_TYPE.accountVoucher ? 'Active' : 'Open'}</Tab>
                        <Tab>{voucherType === VOUCHER_TYPE.accountVoucher ? 'Inactive' : 'Closed'}</Tab>
                    </TabList>
                    {
                        !loading ?
                        <>
                            <TabPanel>
                                { <ActiveTab voucherType={voucherType} products={ activeVouchers }/> }
                            </TabPanel>
                            <TabPanel>
                                { <ActiveTab voucherType={voucherType} products={ inactiveVouchers }/> }
                            </TabPanel>
                        </> : 
                        <>
                            <TabPanel> </TabPanel>
                            <TabPanel> </TabPanel>
                            <Loading />
                        </>
                    }
                    {
                        
                        !voucherBlocks?.length && !loading && account ?
                        <div className="no-vouchers flex column center">
                            <p>You currently have no active vouchers.</p>
                            <IconActivityMessage />
                        </div> : null
                    }
                    {
                        !voucherBlocks?.length && !loading && !account ?
                        <div className="no-vouchers flex column center">
                            <p><strong>No wallet connected.</strong> <br/> Connect to a wallet to view your vouchers.</p>
                            <WalletConnect />
                            {/* <IconActivityMessage /> */}
                        </div> : null
                    }
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
    const { title, image, price, currency, id, expiryDate,
    COMMITTED, REDEEMED, REFUNDED, COMPLAINED, CANCELLED, FINALIZED } = props

    return (
        <div className="voucher-block flex">
            <Link to={ `${ ROUTE.VoucherDetails }/${ id }` }>
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
                    { COMMITTED ? <div className="label color_COMMITTED">COMMITTED</div> : null }
                    { REDEEMED ? <div className="label color_REDEEMED">REDEEMED</div> : null }
                    { REFUNDED ? <div className="label color_REFUNDED">REFUNDED</div> : null }
                    { COMPLAINED ? <div className="label color_COMPLAINED">COMPLAINED</div> : null }
                    { CANCELLED ? <div className="label color_CANCELLED">CANCELLED</div> : null }
                    { new Date() > new Date(expiryDate) ?
                        <div className="label color_EXPIRED">EXPIRED</div> : null }
                    { FINALIZED ? <div className="label color_FINALIZED">FINALIZED</div> : null }
                </div>
            </Link>
        </div>
    )
}