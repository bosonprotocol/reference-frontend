import React, { useContext, useState } from "react";
import { createVoucherSet } from "../../hooks/api";
import { findEventByName, useCashierContract } from "../../hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";
import { getAccountStoredInLocalStorage } from "../../hooks/authenticate";

import Loading from "./Loading"

import { Redirect } from "react-router-dom"

import { SellerContext } from "../../contexts/Seller"
import ContractInteractionButton from "../shared/ContractInteractionButton";
import { useLocation } from 'react-router-dom';
import { ModalContext, ModalResolver } from "../../contexts/Modal";
import { MODAL_TYPES, ROUTE } from "../../helpers/Dictionary";
import { SMART_CONTRACTS_EVENTS } from "../../hooks/configs";

export default function SubmitForm(props) {
    // onFileSelectSuccess={ (file) => setSelectedFile(file) }
    const [redirect, setRedirect] = useState(0)
    const [loading, setLoading] = useState(0)
    const sellerContext = useContext(SellerContext)
    const modalContext = useContext(ModalContext);
    const location = useLocation();

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

    const { resetOfferingData } = props

    const { library, account } = useWeb3React();

    const cashierContract = useCashierContract();
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

        let dataArr = [
            new Date(start_date) / 1000,
            new Date(end_date) / 1000,
            ethers.utils.parseEther(price).toString(),
            ethers.utils.parseEther(seller_deposit).toString(),
            ethers.utils.parseEther(buyer_deposit).toString(),
            parseInt(quantity)
        ];

        const txValue = ethers.BigNumber.from(dataArr[3]).mul(dataArr[5]);

        let tx;
        let receipt;
        let parsedEvent;

        try {
            tx = await cashierContract.requestCreateOrder_ETH_ETH(dataArr, { value: txValue });
            receipt = await tx.wait();
            parsedEvent = await findEventByName(receipt, SMART_CONTRACTS_EVENTS.VoucherSetCreated, '_tokenIdSupply', '_seller', '_quantity', '_paymentType');
        } catch (e) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
            return;
        }

        try {
            prepareVoucherFormData(parsedEvent, dataArr);

            await createVoucherSet(formData, authData.authToken);

            setLoading(0)
            resetOfferingData()
            setRedirect(1)
        } catch (e) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
        }
    }

    function prepareVoucherFormData(parsedEvent, dataArr) {
        const startDate = new Date(dataArr[0] * 1000);
        const endDate = new Date(dataArr[1] * 1000);

        appendFilesToFormData();

        formData.append('title', title);
        formData.append('qty', dataArr[5]);
        formData.append('category', category);
        formData.append('startDate', startDate.getTime());
        formData.append('expiryDate', endDate.getTime());
        formData.append('offeredDate', Date.now());
        formData.append('price', dataArr[2]);
        formData.append('buyerDeposit', dataArr[4]);
        formData.append('sellerDeposit', dataArr[3]);
        formData.append('description', description);
        formData.append('location', "Location");
        formData.append('contact', "Contact");
        formData.append('conditions', condition);
        formData.append('voucherOwner', account);
        formData.append('_tokenIdSupply', parsedEvent._tokenIdSupply);
    }

    // append blob
    // function appendFilesToFormData() {
    //     fetch(image)
    //         .then(res => res.blob())
    //         .then(res => {
    //                 formData.append("fileToUpload", res, res['name'])
    //             }
    //         )
    // }

    // append file
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
                    : <Redirect exact to={ ROUTE.Activity }/>
            }
        </>
    );
}
