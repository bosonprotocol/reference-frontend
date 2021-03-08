import React, { useContext, useState } from "react";
import { createVoucherSet } from "../../hooks/api";
import { findEventByName, useBosonRouterContract, useBosonTokenDepositContract } from "../../hooks/useContract";
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
import { SMART_CONTRACTS_EVENTS, SMART_CONTRACTS } from "../../hooks/configs";
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
        price_currency,
        seller_deposit_currency,
        quantity,
        title,
        category,
        description,
        condition,
        selected_file, // switch with image to use blob
    } = sellerContext.state.offeringData

    const { library, account, chainId } = useWeb3React();
    const bosonRouterContract = useBosonRouterContract();
    const bosonTokenDepositContract = useBosonTokenDepositContract();
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
            toFixed(new Date(start_date) / 1000, 0),
            toFixed(new Date(end_date) / 1000, 0),
            price.toString(),
            seller_deposit.toString(),
            buyer_deposit.toString(),
            parseInt(quantity)
        ];
       
        let parsedEvent;
        try {   
            
            const receipt = await createNewVoucherSet(dataArr, bosonRouterContract, bosonTokenDepositContract, account, chainId, library, price_currency, seller_deposit_currency);
            
            parsedEvent = await findEventByName(receipt, SMART_CONTRACTS_EVENTS.VoucherSetCreated, '_tokenIdSupply', '_seller', '_quantity', '_paymentType');
               } catch (e) {
                console.error(e)

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

        //TODO uncomment Below paymentType
        // formData.append('paymentType', price_currency + seller_deposit_currency);
        formData.append('description', description);
        formData.append('location', "Location");
        formData.append('contact', "Contact");
        formData.append('conditions', condition);
        formData.append('voucherOwner', account);
        formData.append('_tokenIdSupply', parsedEvent._tokenIdSupply);
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
const createNewVoucherSet =  async (dataArr, bosonRouterContract, depositContract, accountAddress, chainId, library, priceCurrency, sellerDepositCurrency) => {
    let tx;

    const currencyCombination = priceCurrency + sellerDepositCurrency;
    const txValue = ethers.BigNumber.from(dataArr[3]).mul(dataArr[5]);
    switch(currencyCombination) {
        case('ETHETH'): {
          

            tx = await bosonRouterContract.requestCreateOrderETHETH(dataArr, { value: txValue });
            return tx.wait();
        }
        case('BSNETH'): {


            tx = await bosonRouterContract.requestCreateOrderTKNETH(SMART_CONTRACTS.BosonTokenPriceContractAddress, dataArr, { value: txValue });
            return tx.wait();
        }
        case('BSNBSN'): {
            //TODO implement
                // const nonce = await depositContract.nonces(accountAddress)

                //string
                // const digest = await getApprovalDigest(
                //     depositContract,
                //     accountAddress,
                //     SMART_CONTRACTS.BosonRouterContractAddress,
                //     txValue.toString(),
                //     nonce.toString(),
                //     toWei(1),
                //     chainId
                // )
         

        }
        case('ETHBSN'): {
              //TODO implement
        }

        default: {
            console.error(`Currencies combination not found ${currencyCombination}`);
            throw new Error('Something went wrong')
        }
    }

    

}

