import React, { useEffect, useContext } from "react";
import { createVoucherSet, getAllVoucherSets } from "../hooks/api";
import { findEventByName, useCashierContract } from "../hooks/useContract";
import { useWeb3React } from "@web3-react/core";
import * as ethers from "ethers";
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";

import { SellerContext } from "../contexts/Seller"

export default function SubmitForm(props) {
    // onFileSelectSuccess={ (file) => setSelectedFile(file) }
    const sellerContext = useContext(SellerContext)

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

    useEffect(() => {
        console.log(selectedFile)
    }, [])

    const { library, account } = useWeb3React();

    const cashierContract = useCashierContract();
    let formData = new FormData();

    async function onCreateVoucherSet() {
        if (!library || !account) {
            alert("Connect your wallet");
            return;
        }

        let dataArr = [
            new Date(start_date) / 1000,
            new Date(end_date) / 1000,
            ethers.utils.parseEther(price).toString(),
            ethers.utils.parseEther(seller_deposit).toString(),
            ethers.utils.parseEther(buyer_deposit).toString(),
            parseInt(quantity)
        ];
        console.log(dataArr);

        const txValue = ethers.BigNumber.from(dataArr[3]).mul(dataArr[5]);

        console.log(txValue);

        const tx = await cashierContract.requestCreateOrder_ETH_ETH(dataArr, { value: txValue });
        console.log(tx);
        const receipt = await tx.wait();
        console.log(receipt);

        const parsedEvent = await findEventByName(receipt, 'LogOrderCreated', '_tokenIdSupply', '_seller', '_quantity', '_paymentType');
        console.log('parsedEvent', parsedEvent)
        const authData = getAccountStoredInLocalStorage(account);
        prepareVoucherFormData(parsedEvent, dataArr);

        const voucherSetResponse = await createVoucherSet(formData, authData.authToken);
        console.log(voucherSetResponse);

        await logVoucherSets();
    }

    function prepareVoucherFormData(parsedEvent, dataArr) {
        console.log('prepareVoucher', parsedEvent)
        const startDate = new Date(dataArr[0] * 1000);
        const endDate =  new Date(dataArr[1] * 1000);

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

    async function logVoucherSets() {
        const allVoucherSets = await getAllVoucherSets();
        console.log(allVoucherSets);
    }

    useEffect(() => {
        logVoucherSets()
    }, []);

    return (
        <div className="button offer primary" role="button"
            onClick={onCreateVoucherSet} >
            OFFER
        </div>
    );
}

// const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
//     const handleFileInput = (e) => {
//         // handle validations
//         const file = e.target.files[0];

//         // ToDo: Have to add some file validations
//         // if (file.size > 1024)
//         //     onFileSelectError({ error: "File size cannot exceed more than 1MB" });
//         // else onFileSelectSuccess(file);

//         onFileSelectSuccess(file)
//     };

//     return (
//         <div className="file-uploader">
//             <input type="file" onChange={ handleFileInput }/>
//         </div>
//     )
// };








// import React, { useEffect, useRef, useState } from "react";
// import { createVoucherSet, getAllVoucherSets } from "../hooks/api";
// import { findEventByName, useCashierContract } from "../hooks/useContract";
// import { useWeb3React } from "@web3-react/core";
// import * as ethers from "ethers";
// import { getAccountStoredInLocalStorage } from "../hooks/authenticate";

// export default function TestApi() {
//     const { library, account } = useWeb3React();

//     const [selectedFile, setSelectedFile] = useState('');

//     const cashierContract = useCashierContract();
//     let formData = new FormData();

//     async function onCreateVoucherSet() {
//         if (!library || !account) {
//             alert("Connect your wallet");
//             return;
//         }

//         const startDate = new Date(2020, 11, 25) / 1000;
//         const endDate = new Date(2021, 11, 25) / 1000;
//         const price = ethers.utils.parseEther("1.5").toString();
//         const sellerDeposit = ethers.utils.parseEther("0.0001").toString();
//         const buyerDeposit = ethers.utils.parseEther("0.0002").toString();
//         const quantity = 1;

//         let dataArr = [
//             startDate,
//             endDate,
//             price,
//             sellerDeposit,
//             buyerDeposit,
//             quantity
//         ];

//         const txValue = ethers.BigNumber.from(sellerDeposit).mul(quantity);

//         console.log(dataArr);
//         console.log(txValue);

//         const tx = await cashierContract.requestCreateOrder_ETH_ETH(dataArr, { value: txValue });
//         console.log(tx);
//         const receipt = await tx.wait();
//         console.log(receipt);

//         const parsedEvent = await findEventByName(receipt, 'LogOrderCreated', '_tokenIdSupply', '_seller', '_quantity', '_paymentType');

//         const authData = getAccountStoredInLocalStorage(account);
//         prepareVoucherFormData(parsedEvent, dataArr);

//         const voucherSetResponse = await createVoucherSet(formData, authData.authToken);
//         console.log(voucherSetResponse);

//         await logVoucherSets();
//     }

//     function prepareVoucherFormData(parsedEvent, dataArr) {
//         const startDate = new Date(dataArr[0] * 1000);
//         const endDate = new Date(dataArr[1] * 1000);

//         appendFilesToFormData();

//         formData.append('title', "Voucher Title");
//         formData.append('qty', dataArr[5]);
//         formData.append('category', "Category");
//         formData.append('startDate', startDate.getTime());
//         formData.append('expiryDate', endDate.getTime());
//         formData.append('offeredDate', Date.now());
//         formData.append('price', dataArr[2]);
//         formData.append('buyerDeposit', dataArr[4]);
//         formData.append('sellerDeposit', dataArr[3]);
//         formData.append('description', "Description");
//         formData.append('location', "Location");
//         formData.append('contact', "Contact");
//         formData.append('conditions', "Conditions");
//         formData.append('voucherOwner', account);
//         formData.append('txHash', parsedEvent.txHash);
//         formData.append('_tokenIdSupply', parsedEvent._tokenIdSupply);
//     }

//     function appendFilesToFormData() {
//         formData.append("fileToUpload", selectedFile, selectedFile['name']);
//     }

//     async function logVoucherSets() {
//         const allVoucherSets = await getAllVoucherSets();
//         console.log(allVoucherSets);
//     }

//     useEffect(() => {
//         logVoucherSets()
//     }, []);

//     return (
//         <div className="flex">
//             <div className="App">
//                 <form>
//                     <FileUploader
//                         onFileSelectSuccess={ (file) => setSelectedFile(file) }
//                         onFileSelectError={ ({ error }) => alert(error) }
//                     />
//                 </form>
//             </div>
//             <div className="button offer primary"
//                  role="button" onClick={ onCreateVoucherSet }>Offer
//             </div>
//         </div>
//     );
// }

// const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
//     const handleFileInput = (e) => {
//         // handle validations
//         const file = e.target.files[0];

//         // ToDo: Have to add some file validations
//         // if (file.size > 1024)
//         //     onFileSelectError({ error: "File size cannot exceed more than 1MB" });
//         // else onFileSelectSuccess(file);

//         onFileSelectSuccess(file)
//     };

//     return (
//         <div className="file-uploader">
//             <input type="file" onChange={ handleFileInput }/>
//         </div>
//     )
// };
