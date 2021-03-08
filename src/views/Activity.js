import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

import "./Activity.scss"

import { GlobalContext } from '../contexts/Global'

import { ROUTE } from "../helpers/Dictionary"

import { Quantity, IconActivityMessage } from "../components/shared/Icons"

import { getAccountVouchers } from "../helpers/VoucherParsers"

import { ModalContext } from "../contexts/Modal";
import { useWeb3React } from "@web3-react/core";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { VOUCHER_TYPE, sortBlocks, ActiveTab } from "../helpers/ActivityHelper"
import Loading from "../components/offerFlow/Loading";

import { WalletConnect } from "../components/modals/WalletConnect"

export function ActivityAccountVouchers({title}) {
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
     

    return <ActivityView title={title ? title : false} loading={loading} voucherBlocks={ accountVouchers } account={account} voucherType={ VOUCHER_TYPE.accountVoucher}/>
}

export function ActivityVoucherSetView() {
    const history = useHistory()
    const globalContext = useContext(GlobalContext);
    const locationPath = history.location.pathname.split('/')

    const voucherSetId = locationPath[locationPath.length -1]

    return <section className="activity atomic-scoped">
        <div className="vouchers-container container">
            <VoucherSetBlock { ...globalContext.state.allVoucherSets.find(voucher => voucher.id === voucherSetId) } key={voucherSetId} />
            <ActivityAccountVouchers title="Vouchers" />
        </div>
    </section>
}

export function ActivityVoucherSets() {
    const [voucherBlocks, setVoucherBlocks] = useState([])
    const globalContext = useContext(GlobalContext);
    const { account } = useWeb3React();

    const voucherSets = globalContext.state.allVoucherSets

    useEffect(() => {
        voucherSets ?
            setVoucherBlocks(voucherSets)
            : setVoucherBlocks([])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voucherSets])

    return voucherBlocks.length ?
        <ActivityView voucherBlocks={ voucherBlocks } account={account} voucherType={ VOUCHER_TYPE.voucherSet }/> : null
}

function ActivityView(props) {
    const { voucherBlocks, voucherType, loading, account, title } = props
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
                    <h1>{title ? title : voucherType === VOUCHER_TYPE.accountVoucher ? 'My Vouchers' : 'Voucher Sets'}</h1>
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
                                {activeVouchers?.length > 0 && !!account?
                                    <ActiveTab voucherType={voucherType} products={ activeVouchers }/> :
                                    activityMessage(1)
                                }
                            </TabPanel>
                            <TabPanel>
                                {inactiveVouchers?.length > 0 && !!account?
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
    const [expand,] = useState(1)
    const { title, image, price, qty, currency, _id } = props //id

    return (
        <Link to={ROUTE.VoucherSetView + `/${_id}`}>
        <div className={ `collapsible state_${ expand > 0 ? 'opened' : 'collapsed' }` }>
            <div className="voucher-block solo flex relative">
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
                        <div className="value flex center"><img src="images/icon-eth.png" alt="eth"/>{ price } { currency }</div>
                        <div className="quantity"><span className="icon"><Quantity/></span> QTY: { qty }</div>
                    </div>
                </div>
            </div>
        </div>
        </Link>
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
            <Link to={ `${ ROUTE.ActivityVouchers }/${ id }` }>
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