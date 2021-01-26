import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from "react-router"
import { Link } from 'react-router-dom'

import "./Activity.scss"

import { GlobalContext } from '../contexts/Global'

import { ROUTE } from "../helpers/Dictionary"

import { Arrow, IconQR, Quantity } from "../components/shared/Icons"

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ProductView from "../components/shared/ProductView"


function Activity() {
    const [productBlocks, setProductBlocks] = useState([])
    const globalContext = useContext(GlobalContext);
    
    const voucherSets = globalContext.state.allVoucherSets

    const history = useHistory()

    useEffect(() => {
        voucherSets ?
            setProductBlocks(voucherSets)
            : setProductBlocks([])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voucherSets])

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

    // const globalContext = useContext(GlobalContext);

    // useEffect(() => {
    //     let openProductView = localStorage.getItem('productIsOpen') && localStorage.getItem('productIsOpen')
    //     let productsReviewed = localStorage.getItem('productsReviewed') ? JSON.parse(localStorage.getItem('productsReviewed')) : false

    //     if (parseInt(openProductView))
    //         globalContext.dispatch(Action.openProduct(productsReviewed[productsReviewed.length - 1]))

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    const currency = 'ETH'; // ToDo: implement it

    return (
        <div className="voucher-block flex">
            <Link to={ `${ ROUTE.VoucherDetails }/${ id }` }>
                <div className="thumb no-shrink">
                    <img src={ image } alt={ title }/>
                </div>
                <div className="info grow">
                    <div className="status">
                        <p>VOUCHER</p>
                    </div>
                    <div className="title elipsis">{ title }</div>
                    <div className="price flex split">
                        <div className="value flex center"><img src="images/icon-eth.png"
                            alt="eth"/> { price } { currency }
                        </div>
                        <div className="quantity"><span className="icon"><Quantity/></span> QTY: { qty }</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Activity
