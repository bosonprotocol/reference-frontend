import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from "react-router"

import "./Activity.scss"

import { GlobalContext, Action } from '../contexts/Global'

import { getVoucherDetails, getVouchers, updateVoucher } from "../hooks/api";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";


import { Arrow, IconQR, Quantity } from "../components/shared/Icons"

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ContractInteractionButton from "../components/shared/ContractInteractionButton";
import { ModalContext, ModalResolver } from "../contexts/Modal";
import { MODAL_TYPES, ROUTE } from "../helpers/Dictionary";
import { decodeData, getEncodedTopic, useVoucherKernelContract } from "../hooks/useContract";
import VOUCHER_KERNEL from "../hooks/ABIs/VoucherKernel";
import { SMART_CONTRACTS_EVENTS, VOUCHER_STATUSES } from "../hooks/configs";
import { Link, useLocation } from "react-router-dom";
import Loading from "../components/offerFlow/Loading";


function ActivityVouchers() {
    const [preparedVouchers, setPreparedVouchers] = useState([])
    const [loading, setLoading] = useState(0)
    const globalContext = useContext(GlobalContext);
    const modalContext = useContext(ModalContext);

    const { library, account } = useWeb3React();

    const location = useLocation();

    const history = useHistory()

    useEffect(() => {
        async function getAccountVouchers() {
            const authData = getAccountStoredInLocalStorage(account);

            const allAccountVouchers = await getVouchers(authData.authToken);
            prepareVouchersData(allAccountVouchers);
        }

        getAccountVouchers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


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
        console.log(parsedVouchers);
    };

    const voucherKernelContract = useVoucherKernelContract();

    async function onRedeem() {
        if (!library || !account) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: 'Please connect your wallet account'
            }));
            return;
        }

        setLoading(1)

        const voucherId = "60081dc494c889a5a1cd7c40"; // ToDo: Implement it
        let tx;
        let data;
        const authData = getAccountStoredInLocalStorage(account);
        const voucherDetails = await getVoucherDetails(voucherId, authData.authToken);
        console.log(voucherDetails);

        try {
            tx = await voucherKernelContract.redeem(voucherDetails.voucher._tokenIdVoucher);

            const receipt = await tx.wait();

            let encodedTopic = await getEncodedTopic(receipt, VOUCHER_KERNEL.abi, SMART_CONTRACTS_EVENTS.VoucherRedeemed);
            data = await decodeData(receipt, encodedTopic, ['uint256', 'address', 'bytes32']);
            console.log("Redeem event data");
            console.log(data);

        } catch (e) {
            setLoading(0);
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
            return;
        }


        try {
            const data = {
                _id: voucherId,
                status: VOUCHER_STATUSES.REDEEMED
            };

            const redeemResponse = await updateVoucher(data, authData.authToken);
            console.log(redeemResponse);
        } catch (e) {
            setLoading(0);
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
        }

        setLoading(0)
    }


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
                        { <ActiveView loading={ loading } products={ preparedVouchers }/> }
                        <ContractInteractionButton
                            className="button button -green"
                            handleClick={ onRedeem }
                            label="REDEEM"
                            sourcePath={ location.pathname }
                        />
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
    const { products, loading } = props;
    return (
        <>
            { loading ? <Loading/> : null }
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
