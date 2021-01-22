import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import QRCode from "qrcode.react";

import "./StaticPage.scss"

import { MODAL_TYPES, ROUTE } from '../helpers/Dictionary'
import ContractInteractionButton from "../components/shared/ContractInteractionButton";
import { ModalContext, ModalResolver } from "../contexts/Modal";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { getVoucherDetails, updateVoucher } from "../hooks/api";
import { decodeData, getEncodedTopic, useVoucherKernelContract } from "../hooks/useContract";
import VOUCHER_KERNEL from "../hooks/ABIs/VoucherKernel";
import { SMART_CONTRACTS_EVENTS, VOUCHER_STATUSES } from "../hooks/configs";
import { useWeb3React } from "@web3-react/core";
import { useContext, useState } from 'react'
import Loading from "../components/offerFlow/Loading";

function ShowQR(props) {
    const voucherId = props.match.params.id;
    const { library, account } = useWeb3React();
    const modalContext = useContext(ModalContext);
    const [loading, setLoading] = useState(0);
    const location = useLocation();
    const history = useHistory();

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

        setLoading(1);

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
            history.push(ROUTE.Home)
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
        <>
            { loading ? <Loading/> : null }
            {
                <section className="show-qr-code static-page atomic-scoped flex ai-center">
                    <div className="container l infinite">
                        <div className="wrapper w100 relative flex column center">
                            <div className="top-nav">
                                <Link to={ ROUTE.Home }>
                                    <div className="cancel"><span className="icon"></span></div>
                                </Link>
                            </div>
                            <div className="info show-qr flex column ai-center">
                                <div className="thumbnail">
                                    {/*<img src={productAPI[imageThumbId].image} alt=""/>*/ }
                                </div>
                                <h1>Show the QR code to the seller</h1>
                                <div className="qr-container">
                                    <QRCode value={ voucherId } includeMargin={ true }/>
                                </div>
                                <p className="descrption">{ voucherId }</p>
                            </div>
                            <ContractInteractionButton
                                className="button button -green"
                                handleClick={ onRedeem }
                                label="REDEEM"
                                sourcePath={ location.pathname }
                            />
                        </div>
                    </div>
                </section>
            }
        </>
    )
}

export default ShowQR
