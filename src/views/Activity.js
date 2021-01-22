import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from "react-router"
import { Link } from 'react-router-dom'

import "./Activity.scss"

import { GlobalContext, Action } from '../contexts/Global'

import { getAllVoucherSets } from "../hooks/api";
import * as ethers from "ethers";

import { ROUTE } from "../helpers/Dictionary"

import { Arrow, IconQR, Quantity } from "../components/shared/Icons"

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ProductView from "../components/shared/ProductView"


function Activity() {
    const [productBlocks, setProductBlocks] = useState([])

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
        {
            globalContext.state.productView.open ?
                <ProductView/> :
                null
        }
        </>
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
    const { title, image, price, qty, id } = props

    const globalContext = useContext(GlobalContext);

    const openProduct = (product) => {
        globalContext.dispatch(Action.openProduct(product));

        // const selectedProduct = globalContext.state.allVoucherSets.find(x => x.id === product);

        // globalContext.dispatch(Action.navigationControl(selectedProduct?.qty === 0 ? DIC.NAV.DEF : DIC.NAV.COMMIT))
    };

    useEffect(() => {
        let openProductView = localStorage.getItem('productIsOpen') && localStorage.getItem('productIsOpen')
        let productsReviewed = localStorage.getItem('productsReviewed') ? JSON.parse(localStorage.getItem('productsReviewed')) : false

        if (parseInt(openProductView))
            globalContext.dispatch(Action.openProduct(productsReviewed[productsReviewed.length - 1]))

        async function getVoucherSets() {
            const allVoucherSets = await getAllVoucherSets();
            prepareVoucherSetData(allVoucherSets);
        }

        getVoucherSets()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const prepareVoucherSetData = (rawVoucherSets) => {

        let parsedVoucherSets = [];


        for (const voucherSet of rawVoucherSets.voucherSupplies) {
            let parsedVoucherSet = {
                id: voucherSet._id,
                title: voucherSet.title,
                image: voucherSet.imagefiles[0]?.url ? voucherSet.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
                price: ethers.utils.formatEther(voucherSet.price.$numberDecimal),
                buyerDeposit: ethers.utils.formatEther(voucherSet.buyerDeposit.$numberDecimal),
                sellerDeposit: ethers.utils.formatEther(voucherSet.sellerDeposit.$numberDecimal),
                deposit: ethers.utils.formatEther(voucherSet.buyerDeposit.$numberDecimal),
                description: voucherSet.description,
                category: voucherSet.category,
                startDate: voucherSet.startDate,
                expiryDate: voucherSet.expiryDate,
                qty: voucherSet.qty,
                setId: voucherSet._tokenIdSupply,
                voucherOwner: voucherSet.voucherOwner
            };

            parsedVoucherSets.push(parsedVoucherSet)
        }

        globalContext.dispatch(Action.allVoucherSets(parsedVoucherSets));
    };

    const currency = 'ETH'; // ToDo: implement it

    return (
        <div className="voucher-block flex"
        onClick={()=>openProduct(id)}>
            <Link to={`${ROUTE.VoucherDetails}/${id}`}>
            <div className="thumb no-shrink">
                <img src={ image } alt={ title }/>
            </div>
            <div className="info grow">
                <div className="status">
                    <p>VOUCHER SET</p>
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
            </div>
            </Link>
        </div>
    )
}

export default Activity
