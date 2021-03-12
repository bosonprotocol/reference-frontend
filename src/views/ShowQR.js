import React from 'react'
import { useLocation } from 'react-router-dom'
import QRCode from "qrcode.react";

import "./StaticPage.scss"

import { MODAL_TYPES, ROUTE, MESSAGE } from '../helpers/Dictionary'
import ContractInteractionButton from "../components/shared/ContractInteractionButton";
import { ModalContext, ModalResolver } from "../contexts/Modal";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { getVoucherDetails } from "../hooks/api";
import {  useBosonRouterContract } from "../hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import { useContext, useState } from 'react'
import Loading from "../components/offerFlow/Loading";
import MessageScreen from "../components/shared/MessageScreen"

function ShowQR(props) {
    const voucherId = props.match.params.id;
    const { library, account } = useWeb3React();
    const modalContext = useContext(ModalContext);
    const [loading, setLoading] = useState(0);
    const [messageType, setMessageType] = useState(false);
    const [link, setLink] = useState(ROUTE.Home);

    const location = useLocation();
    
    const successMessage = "Redemption was successful"
    const errorMessage = "Redemption error"
    const errorSubMessage = "The item is no longer available or it the QR code isn't correct"
    const [messageText, setMessageText] = useState(errorSubMessage);
    
    const bosonRouterContract = useBosonRouterContract();

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

        const authData = getAccountStoredInLocalStorage(account);
        const voucherDetails = await getVoucherDetails(voucherId, authData.authToken);

        try {
            await bosonRouterContract.redeem(voucherDetails.voucher._tokenIdVoucher);
            setLink(ROUTE.ActivityVouchers + '/' + voucherId + '/details')
            setMessageType(MESSAGE.SUCCESS)
        } catch (e) {
            setLoading(0);
            setMessageType(MESSAGE.ERROR)
            setMessageText(e.message)
            return;
        }

        setLoading(0)
    }

    return (
        <>
            { loading ? <Loading/> : null }
            {   !messageType ?
                <section className="show-qr-code static-page atomic-scoped flex ai-center">
                    <div className="container l infinite">
                        <div className="wrapper w100 relative flex column center">
                            <div className="info show-qr flex column ai-center">
                                <div className="thumbnail">
                                    {/*<img src={productAPI[imageThumbId].image} alt=""/>*/ }
                                </div>
                                <h1>Show the QR code to the seller</h1>
                                <div className="qr-container">
                                    <QRCode size="170" value={ voucherId } includeMargin={ true }/>
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
                </section> :
                <MessageScreen 
                    messageType={messageType} 
                    title={messageType === 'success' ? successMessage : errorMessage} 
                    text={messageType === 'success' ? false : messageText} 
                    link={link}
                    setMessageType={messageType === 'success' ? false : setMessageType}
                />
            }
        </>
    )
}

export default ShowQR
