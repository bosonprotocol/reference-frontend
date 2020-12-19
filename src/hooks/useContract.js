import { useMemo } from 'react'
import { useWeb3React } from "@web3-react/core";
import { getContract } from "../utils";
import { SMART_CONTRACTS } from "./configs";
import CASHIER_ABI from "./ABIs/Cashier";

function useContract(address, ABI, withSignerIfPossible = true) {
    const { library, account } = useWeb3React()

    return useMemo(() => {
        if (!address || !ABI || !library) return null
        try {
            return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library, withSignerIfPossible, account])
}

export function useCashierContract() {
    return useContract(SMART_CONTRACTS.CashierContractAddress, CASHIER_ABI.abi)
}

export function findEventByName(txReceipt, eventName, ...eventFields) {

    for (const key in txReceipt.events) {
        if (txReceipt.events[key].event == eventName) {
            const event = txReceipt.events[key]

            const resultObj = {
                txHash: txReceipt.transactionHash
            }

            for (let index = 0; index < eventFields.length; index++) {
                resultObj[eventFields[index]] = event.args[eventFields[index]].toString();
            }
            return resultObj
        }
    }
}
