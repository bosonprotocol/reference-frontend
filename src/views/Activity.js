
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
    const [loading, setLoading] = useState(0)
  
    useEffect(() => {
        setLoading(1);

        getAccountVouchers(account, modalContext).then(result => {
            setLoading(0);
            setAccountVouchers(result)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);
    

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

    const getLastAction = (el) => {
        let latest = 0;
        const compareDates = (el) => el ? 
        new Date(el).getTime() > latest ? 
            new Date(el).getTime() 
            : latest 
        : latest

        latest = compareDates(el.CANCELLED)
        latest = compareDates(el.COMMITTED)
        latest = compareDates(el.COMPLAINED)
        latest = compareDates(el.EXPIRED)
        latest = compareDates(el.FINALIZED)
        latest = compareDates(el.REDEEMED)
        latest = compareDates(el.REFUNDED)
        
        return latest
    }

    const blocksSorted = sortBlocks(voucherBlocks, voucherType, globalContext)

    const activeVouchers = blocksSorted.active?.sort((a, b) => getLastAction(a) > getLastAction(b) ? -1 : 1)
    const inactiveVouchers = blocksSorted.inactive?.sort((a, b) => getLastAction(a) > getLastAction(b) ? -1 : 1)

    const activityMessage = (tab) => {
        return account ?
        <div className="no-vouchers flex column center">
        <p>You currently have no {`${tab?'active':'inactive'}`} vouchers.</p>
        <IconActivityMessage />
        </div>
        :
        <div className="no-vouchers flex column center">
        <p><strong>No wallet connected.</strong> <br/> Connect to a wallet to view your vouchers.</p>
        <WalletConnect />
        </div>
    }

    return (
        <>
        <section className="activity atomic-scoped">
            <div className="container">
                <div className="page-title">
                    <h1>{voucherType === VOUCHER_TYPE.accountVoucher ? 'Activity' : 'Voucher Sets'}</h1>
                </div>
                {
                !loading ?
                <Tabs>
                    <TabList>
                        <Tab>{voucherType === VOUCHER_TYPE.accountVoucher ? 'Active' : 'Open'}</Tab>
                        <Tab>{voucherType === VOUCHER_TYPE.accountVoucher ? 'Inactive' : 'Closed'}</Tab>
                    </TabList>
                        <>
                            <TabPanel>
                                {activeVouchers?.length?
                                    <ActiveTab voucherType={voucherType} products={ activeVouchers }/> :
                                    activityMessage(1)
                                }
                            </TabPanel>
                            <TabPanel>
                                {inactiveVouchers?.length?
                                    <ActiveTab voucherType={voucherType} products={ inactiveVouchers }/> :
                                    activityMessage()
                                }
                            </TabPanel>
                        </> 
                </Tabs>
                : <Loading />
                }

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

    const statusOrder = {
        'COMMITTED': new Date(COMMITTED).getTime(),
        'REDEEMED': new Date(REDEEMED).getTime(),
        'REFUNDED': new Date(REFUNDED).getTime(),
        'COMPLAINED': new Date(COMPLAINED).getTime(),
        'CANCELLED': new Date(CANCELLED).getTime(),
    }

    const statuses = statusOrder ? Object.entries(statusOrder)
    .sort(([,a],[,b]) => a-b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}) : null



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
                    {statuses ? Object.keys(statuses).map((status, i) => statusOrder[status] ? <div key={i} className={`label color_${status}`}>{status}</div> : null) : null}
                    { new Date() > new Date(expiryDate) ?
                        <div className="label color_EXPIRED">EXPIRED</div> : null }
                    { FINALIZED ? <div className="label color_FINALIZED">FINALIZED</div> : null }
                </div>
            </Link>
        </div>
    )
}