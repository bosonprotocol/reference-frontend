import React, { useContext, useState } from "react";
import { createVoucherSet } from "../../hooks/api";
import { findEventByName, useBosonRouterContract } from "../../hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";
import { getAccountStoredInLocalStorage } from "../../hooks/authenticate";
import MessageScreen from "../shared/MessageScreen"

import Loading from "./Loading"

import { SellerContext } from "../../contexts/Seller"
import { GlobalContext, Action } from "../../contexts/Global"
import ContractInteractionButton from "../shared/ContractInteractionButton";
import { useLocation } from 'react-router-dom';
import { ModalContext, ModalResolver } from "../../contexts/Modal";
import { MODAL_TYPES, MESSAGE, ROUTE } from "../../helpers/Dictionary";
import { SMART_CONTRACTS_EVENTS } from "../../hooks/configs";
import { toFixed } from "../../utils/format-utils";

export default function SubmitForm() {
    const [redirect, setRedirect] = useState(0);
    const [loading, setLoading] = useState(0);
    const sellerContext = useContext(SellerContext);
    const modalContext = useContext(ModalContext); 
    const location = useLocation();

    const globalContext = useContext(GlobalContext);

    const messageTitle = "Voucher set published";

    const {
        start_date,
        end_date,
        price,
        seller_deposit,
        buyer_deposit,
        quantity,
        title,
        category,
        description,
        condition,
        selected_file, // switch with image to use blob
    } = sellerContext.state.offeringData

    const { library, account } = useWeb3React();
    const bosonRouterContract = useBosonRouterContract();
    let formData = new FormData();

    async function onCreateVoucherSet() {
        if (!library || !account) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: 'Please connect your wallet account'
            }));
            return;
        }

        const authData = getAccountStoredInLocalStorage(account);

        if (!authData.activeToken) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: 'Please check your wallet for Signature Request. Once authentication message is signed you can proceed'
            }));
            return;
        }

        setLoading(1)


        // let dataArr = [
        //     toFixed(new Date(start_date) / 1000, 0),
        //     toFixed(new Date(end_date) / 1000, 0),
        //     price.toString(),
        //     seller_deposit.toString(),
        //     buyer_deposit.toString(),
        //     parseInt(quantity)
        // ];
        // const txValue = ethers.BigNumber.from(dataArr[3]).mul(dataArr[5]);

        let tx;
        let receipt;
        let parsedEvent;

        try {                          
            // tx = await bosonRouterContract.requestCreateOrderETHETH(dataArr, { value: txValue });
            // receipt = await tx.wait();
            // parsedEvent = await findEventByName(receipt, SMART_CONTRACTS_EVENTS.VoucherSetCreated, '_tokenIdSupply', '_seller', '_quantity', '_paymentType');             
        } catch (e) {     
            setLoading(0)
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
            return;
        } 

        try {
            prepareVoucherFormData(parsedEvent, 'dataArr');

            await createVoucherSet(formData, authData.authToken);

            globalContext.dispatch(Action.fetchVoucherSets());

            setLoading(0);
            setRedirect(1);
        } catch (e) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
        }
    }

    function prepareVoucherFormData(parsedEvent, dataArr) {
        // const startDate = new Date(dataArr[0] * 1000);
        // const endDate = new Date(dataArr[1] * 1000);

        appendFilesToFormData();


        formData.append('title', "This is myt title");
        formData.append('qty', 1);
        formData.append('category', "category");
        formData.append('startDate', 1615327200000);
        formData.append('expiryDate', 1617224399000);
        formData.append('offeredDate', 1615388785719);
        formData.append('price', 15);
        formData.append('buyerDeposit', 5);
        formData.append('sellerDeposit', 1);
        formData.append('description', "description");
        formData.append('location', "Location");
        formData.append('contact', "Contact");
        formData.append('conditions', 'condition');
        formData.append('voucherOwner', '0xE33Cfa2B6ea374E38EFC0Ea08bfd2E3d5101e456'.toLocaleLowerCase());
        formData.append('_tokenIdSupply', '57896044618658097711785492504343954003538807256952374762451453283536180609024');
    }

    function appendFilesToFormData() {
        formData.append("fileToUpload", selected_file, selected_file['name']);
    }

    return (
        <>
            { loading ? <Loading/> : null }
            {
                !redirect ?
                    <ContractInteractionButton
                        className="button offer primary"
                        handleClick={ onCreateVoucherSet }
                        label="OFFER"
                        sourcePath={ location.pathname }
                    />
                    : <MessageScreen messageType={MESSAGE.SUCCESS} title={messageTitle} link={ROUTE.Home} />
            }
        </>
    );
}
