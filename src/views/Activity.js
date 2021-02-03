import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from "react-router"
import { Link } from 'react-router-dom'

import "./Activity.scss"

import { GlobalContext } from '../contexts/Global'

import { ROUTE } from "../helpers/Dictionary"

import { Arrow, IconQR, Quantity, QRCodeScaner } from "../components/shared/Icons"

import { initVoucherDetails } from "../helpers/VoucherParsers"
import { ModalContext } from "../contexts/Modal";
import { getVoucherDetails } from "../hooks/api";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const blockTypes = {
    account: 1,
    voucherSet: 2,
}

const sortBlocks = (blocksArray) => {
    const sortedBlocks = {}

    sortedBlocks.active = blocksArray.filter(block => block.qty > 0)
    sortedBlocks.inactive = blocksArray.filter(block => block.qty <= 0)

    return sortedBlocks
}

const getDesiredBlockType = (blockType, props, id) => ( blockType === blockTypes.account ?
    <SingleVoucherBlock { ...props } key={id} />:
    <VoucherSetBlock { ...props } key={id} />
)

const ActiveTab = (props) => {
    const { products, blockType } = props
    return (
        <div className="vouchers-container">
            {
                products.map((block, id) => getDesiredBlockType(blockType, block, id))
            }
        </div>
    )
}

function ActivityView(props) {
    const { voucherBlocks, blockType } = props
    const history = useHistory()

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
                    <Link to={ROUTE.CodeScanner} >
                        <div className="qr-icon" role="button"><IconQR color="#8393A6" noBorder/></div>
                    </Link>
                </div>
                <div className="page-title">
                    <h1>{blockType === blockTypes.account ? 'Activity' : 'Voucher Sets'}</h1>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Active</Tab>
                        <Tab>Inactive</Tab>
                    </TabList>

                    <TabPanel>
                        { <ActiveTab blockType={blockType} products={ activeVouchers }/> }
                    </TabPanel>
                    <TabPanel>
                        { <ActiveTab blockType={blockType} products={ inactiveVouchers }/> }
                    </TabPanel>
                </Tabs>

            </div>
        </section>
        </>
    )
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

    return voucherBlocks.length ? <ActivityView voucherBlocks={voucherBlocks} blockType={blockTypes.voucherSet} /> : null
}

export function ActivityAccountVouchers() {
    const [voucherBlocks, setVoucherBlocks] = useState([])
    const globalContext = useContext(GlobalContext);
    
    const accountVouchers = globalContext.state.accountVouchers

    useEffect(() => {
        accountVouchers ?
            setVoucherBlocks(accountVouchers)
            : setVoucherBlocks([])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountVouchers])

    return voucherBlocks.length ? <ActivityView voucherBlocks={voucherBlocks} blockType={blockTypes.account} /> : null
}

const ChildVoucherBlock = ({title, expiration, id}) => (
    <Link to={ `${ ROUTE.VoucherSetDetails }/${ id }` }>
        <div className="voucher-block solo sub flex ai-center">
            <div className="img no-shrink">
                <QRCodeScaner />
            </div>
            <div className="description">
                <h2 className="title elipsis">{title}</h2>
                {/* <div className="expiration">{expiration}</div> */}
            </div>
            {/* <div className="statuses">
                <div className="label">COMMITED</div>
                <div className="label">REDEEMED</div>
            </div> */}
        </div>
    </Link>
)

const VoucherSetBlock = (props) => {
    const [expand, setExpand] = useState(-1)
    const [matchingVouchers, setMatchingVouchers] = useState([])
    const { title, image, price, qty, currency, _id } = props //id  
    const globalContext = useContext(GlobalContext);

    useEffect(() => {
        if(globalContext.state.allVoucherSets) setMatchingVouchers(globalContext.state.allVoucherSets.filter(voucher => voucher.id === _id))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={`collapsible state_${expand > 0 ? 'opened' : 'collapsed'}`}>
            <div className="voucher-block solo flex relative" onClick={() => setExpand(expand*-1)}>
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
                {matchingVouchers ? matchingVouchers.map(voucher => <ChildVoucherBlock key={voucher.id} id={voucher.id} title={voucher.title} expiration={2} />) : null}
            </div>
        </div>
    )
}

const SingleVoucherBlock = (props) => {
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
                    {voucherData?.FINALIZED ? <div className="label color_FINALIZED">FINALIZED</div> : null}
                    {voucherData ? new Date() > new Date(voucherData.expiryDate) ? <div className="label color_EXPIRED">EXPIRED</div> : null : null}
                    {voucherData?.CANCELLED ? <div className="label color_CANCELLED">CANCELLED</div> : null}
                    {voucherData?.COMMITTED ? <div className="label color_COMMITTED">COMMITTED</div> : null}
                    {voucherData?.COMPLAINED ? <div className="label color_COMPLAINED">COMPLAINED</div> : null}
                    {voucherData?.REDEEMED ? <div className="label color_REDEEMED">REDEEMED</div> : null}
                    {voucherData?.REFUNDED ? <div className="label color_REFUNDED">REFUNDED</div> : null}
                </div>
            </Link>
        </div>
    )
}


