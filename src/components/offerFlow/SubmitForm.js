import React, { useContext, useState } from "react";
import { createVoucherSet } from "../../hooks/api";
import { findEventByName, getApprovalDigest, toWei, useBosonRouterContract, useBosonTokenDepositContract } from "../../hooks/useContract";
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
import {ecsign} from "ethereumjs-util";
import {fromRpcSig} from 'ethereumjs-util'
import { arrayify } from "ethers/lib/utils";
export default function SubmitForm(props) {
    // onFileSelectSuccess={ (file) => setSelectedFile(file) }
    const [redirect, setRedirect] = useState(0)
    const [loading, setLoading] = useState(0)
    const sellerContext = useContext(SellerContext)
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
            ethers.utils.parseEther(price).toString(),
            ethers.utils.parseEther(seller_deposit).toString(),
            ethers.utils.parseEther(buyer_deposit).toString(),
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

            globalContext.dispatch(Action.fetchVoucherSets())

            setLoading(0)
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
        // formData.append('sellerDepositCurrency', seller_deposit_currency);
        // formData.append('priceCurrency', price_currency);
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

                const nonce = await depositContract.nonces(accountAddress)

                //string
                const digest = await getApprovalDigest(
                    depositContract,
                    accountAddress,
                    SMART_CONTRACTS.BosonRouterContractAddress,
                    txValue.toString(),
                    nonce.toString(),
                    toWei(1),
                    chainId
                )
                    
                const  signature = await bosonRouterContract.signer.signMessage(arrayify(Buffer.from(digest.slice(2), 'hex')))
                const {v,r,s} = await fromRpcSig(signature);

                console.log(v,r,s)
            const data = [...dataArr];
            const res2 = ecsign(
                Buffer.from(digest.slice(2), 'hex'),
                Buffer.from("0x45d361a6907d485a9864649a0f3949b3490b38424ac713b158571d832d2485c3".slice(2), 'hex')
            );
        
            console.log(res2)
            tx = await bosonRouterContract.requestCreateOrderTKNTKNWithPermit(
                SMART_CONTRACTS.BosonTokenPriceContractAddress,
                depositContract.address,
                txValue,
                toWei(1),
                v, r, s,
                data
            );
            return tx.wait();
        }
        default: {
            console.error(`Currencies combination not found ${currencyCombination}`);
            throw new Error('Something went wrong')
        }
    }

    

}

