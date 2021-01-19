import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from "react-router"
import { Link } from 'react-router-dom'

import "./Activity.scss"

import { GlobalContext, Action } from '../contexts/Global'

import { getAllVoucherSets, getVouchers } from "../hooks/api";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";

import { ROUTE } from "../helpers/Dictionary"

import { Arrow, IconQR, Quantity } from "../components/shared/Icons"

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


function Activity() {
    const [productBlocks, setProductBlocks] = useState([])
    const { account } = useWeb3React();

    const globalContext = useContext(GlobalContext);

    const history = useHistory()

    useEffect(() => {
        async function getVoucherSets() {
            const allVoucherSets = await getAllVoucherSets();
            prepareVoucherSetData(allVoucherSets)
        }

        getVoucherSets()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const prepareVoucherSetData = (rawVoucherSets) => {
        if (!rawVoucherSets) {
            setProductBlocks([])
            return;
        }

        let parsedVoucherSets = [];

        for (const voucherSet of rawVoucherSets.voucherSupplies) {
            let parsedVoucherSet = {
                id: voucherSet._id,
                title: voucherSet.title,
                image: voucherSet.imagefiles[0]?.url ? voucherSet.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
                price: ethers.utils.formatEther(voucherSet.price.$numberDecimal),
                deposit: ethers.utils.formatEther(voucherSet.buyerDeposit.$numberDecimal),
                qty: voucherSet.qty
            };

            parsedVoucherSets.push(parsedVoucherSet)
        }

        setProductBlocks(parsedVoucherSets)
    };

    return (
        <section className="activity atomic-scoped">
            <div className="container">
                <div className="top-navigation flex split">
                    <div className="button square dark" role="button"
                         onClick={ () => history.goBack() }
                    >
                        <Arrow color="#80F0BE"/>
                    </div>
                    <div className="qr-icon" role="button"
                         onClick={ () => globalContext.dispatch(Action.toggleQRReader(1)) }><IconQR color="#8393A6"
                                                                                                    noBorder/></div>
                </div>
                <div className="title">
                    <h1>Activity</h1>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Active</Tab>
                        <Tab>Inactive</Tab>
                    </TabList>

                    <TabPanel>
                        { <ActiveView products={ productBlocks }/> }
                    </TabPanel>
                    <TabPanel>
                        { <InactiveView products={ productBlocks }/> }
                    </TabPanel>
                </Tabs>

            </div>
        </section>
    )
}


const ActiveView = (props) => {
    const { products } = props
    return (
        <div className="vouchers-container">
            {
                products.map((block, id) => <Block { ...block } key={ id }/>)
            }
        </div>
    )
}

const InactiveView = () => {
    return (
        <div className="vouchers-container">
            ... No vouchers
        </div>
    )
}

const Block = (props) => {
    const { title, image, price, qty, id } = props;

    const currency = 'ETH'; // ToDo: implement it

    return (
        <div className="voucher-block">
            <Link to={`${ROUTE.SingleVoucher}/${id}`}>
                <div className="thumb no-shrink">
                    <img src={ image } alt={ title }/>
                </div>
                <div className="info grow">
                    <div className="status">
                        <p>VOUCHER</p>
                    </div>
                    <div className="title elipsis">{ title }</div>
                    <div className="price flex split">
                        <div className="value flex center"><img src="images/icon-eth.png" alt="eth"/> { price } { currency }
                        </div>
                        <div className="quantity"><span className="icon"><Quantity/></span> QTY: { qty }</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Activity
