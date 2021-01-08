import React, { useEffect, useContext } from "react";
import { createVoucherSet, getAllVoucherSets } from "../../hooks/api";
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

    } = sellerContext.state.offeringData

    const { selectedFile } = props

    const { library, account } = useWeb3React();

    const cashierContract = useCashierContract();
    let formData = new FormData();

    async function onCreateVoucherSet() {
        if (!library || !account) {
            alert("Connect your wallet");
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
            parsedEvent = await findEventByName(receipt, 'LogOrderCreated', '_tokenIdSupply', '_seller', '_quantity', '_paymentType');
        } catch (e) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
            return;
        }

        const authData = getAccountStoredInLocalStorage(account);

        try {
            prepareVoucherFormData(parsedEvent, dataArr);
            const voucherSetResponse = await createVoucherSet(formData, authData.authToken);
            console.log(voucherSetResponse);

            setLoading(0)

            if(voucherSetResponse.success) {
                resetOfferingData()
                setRedirect(1)
            }
            
            await getVoucherSets();
        } catch (e) {
            modalContext.dispatch(ModalResolver.showModal({
                show: true,
                type: MODAL_TYPES.GENERIC_ERROR,
                content: e.message
            }));
        }
    }

    function prepareVoucherFormData(parsedEvent, dataArr) {
        console.log('prepareVoucher', parsedEvent)
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
        formData.append('txHash', parsedEvent.txHash);
        formData.append('_tokenIdSupply', parsedEvent._tokenIdSupply);
    }

    function appendFilesToFormData() {
        console.log(selectedFile)
        formData.append("fileToUpload", selectedFile, selectedFile['name']);
    }

    async function getVoucherSets() {
        const allVoucherSets = await getAllVoucherSets();
        console.log(allVoucherSets);
    }

    useEffect(() => {
        getVoucherSets()
    }, []);

    return (
    <>
        {loading ? <Loading /> : null}
        {
        !redirect ?
        <ContractInteractionButton
            className="button offer primary"
            handleClick={ onCreateVoucherSet }
            label="OFFER"
            sourcePath={ location.pathname }
        />
    );
}