export const waitForRecentTransactionIfSuchExists = (library, voucherDetails, voucherSetDetails, setRecentlySignedTxHash) => {
    const localStorageList = JSON.parse(localStorage.getItem('recentlySignedTxIdToSupplyIdList')) || [];
            
    const recentlySignedTxHash = voucherDetails ?  localStorageList.filter(x => x.supplyId === voucherDetails._tokenIdVoucher).map(x => x.txHash)[0] :
                                                   localStorageList.filter(x => x.supplyId === voucherSetDetails._tokenIdSupply).map(x => x.txHash)[0];
    if(recentlySignedTxHash) {
        const getTxReceiptAndCheckForCompletion = async () => {
            const receipt = await library.getTransactionReceipt(recentlySignedTxHash);
            if (!receipt) {
                setRecentlySignedTxHash(recentlySignedTxHash)
    
                const awaitForTx = async () => {
                    const locationBeforeTxWait = window.location;
                    await library.waitForTransaction(recentlySignedTxHash);
                    
                    const localStorageListWithDeletedTx = localStorageList.filter(x => x.txHash !==recentlySignedTxHash);
                    localStorage.setItem('recentlySignedTxIdToSupplyIdList', JSON.stringify(localStorageListWithDeletedTx))                            

                    if(locationBeforeTxWait.href === window.location.href) {
                        // eslint-disable-next-line no-self-assign
                        window.location = window.location
                    }
                }
                awaitForTx();               
            }
        }
        getTxReceiptAndCheckForCompletion()
    }
}
export const setTxHashToSupplyId = (txHash, supplyId) => {
    const localStorageList = JSON.parse(localStorage.getItem('recentlySignedTxIdToSupplyIdList')) || [];
    const newList = localStorageList.filter(x=> x.supplyId !== supplyId);
    newList.push({supplyId, txHash})
    localStorage.setItem('recentlySignedTxIdToSupplyIdList', JSON.stringify(newList));
}
