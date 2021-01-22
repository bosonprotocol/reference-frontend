import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from "react-router"

import "./Activity.scss"

import { getVouchers } from "../hooks/api";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";


import { Arrow, IconQR, Quantity } from "../components/shared/Icons"

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { MODAL_TYPES, ROUTE } from "../helpers/Dictionary";
import { Link } from "react-router-dom";
import { ModalContext, ModalResolver } from "../contexts/Modal";

function ActivityVouchers() {
    const [preparedVouchers, setPreparedVouchers] = useState([])

    const { account } = useWeb3React();
    const modalContext = useContext(ModalContext);

    const history = useHistory();

    useEffect(() => {
        async function getAccountVouchers() {
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

            const allAccountVouchers = await getVouchers(authData.authToken);
            prepareVouchersData(allAccountVouchers);
        }

        getAccountVouchers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])


    const prepareVouchersData = (rawVouchers) => {
        if (!rawVouchers) {
            setPreparedVouchers([]);
            return;
        }

        let parsedVouchers = [];

        for (const voucher of rawVouchers.voucherData) {
            let parsedVoucher = {
                id: voucher._id,
                tokenIdVoucher: voucher._tokenIdVoucher,
                title: voucher.title,
                image: voucher.imagefiles[0]?.url ? voucher.imagefiles[0].url : 'images/temp/product-block-image-temp.png',
                price: ethers.utils.formatEther(voucher.price.$numberDecimal),
                qty: voucher.qty
                // deposit: ethers.utils.formatEther(voucher.buyerDeposit.$numberDecimal)
            };

            parsedVouchers.push(parsedVoucher)
        }

        setPreparedVouchers(parsedVouchers)
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
                    <Link to={ ROUTE.CodeScanner }>
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
                        { <ActiveView products={ preparedVouchers }/> }
                    </TabPanel>
                    <TabPanel>
                        { <InactiveView products={ preparedVouchers }/> }
                    </TabPanel>
                </Tabs>

            </div>
        </section>
    )
}


const ActiveView = (props) => {
    const { products } = props;
    return (
        <>
            {
                <div className="vouchers-container">
                    {
                        products.map((block, id) => <Block { ...block } key={ id }/>)
                    }
                </div>
            }
        </>
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
    const { id, title, image, price, qty } = props;

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

export default ActivityVouchers
