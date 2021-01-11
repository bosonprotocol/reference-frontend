import { useMemo } from 'react'
import { useWeb3React } from "@web3-react/core";
import { getContract } from "../utils";
import { SMART_CONTRACTS } from "./configs";
import CASHIER_ABI from "./ABIs/Cashier";
import * as ethers from "ethers";

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

export async function findEventByName(txReceipt, eventName, ...eventFields) {
    for (const key in txReceipt.events) {
        if (txReceipt.events[key].event === eventName) {
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

export async function getEncodedTopic(receipt, abi, eventName) {
    const interfaceInstance = new ethers.utils.Interface(abi);
    for (const log in receipt.logs) {
        const topics = receipt.logs[log].topics;
        for (const index in topics) {

            const encodedTopic = topics[index];

            try {
                // CHECK IF  TOPIC CORRESPONDS TO THE EVENT GIVEN TO FN
                let event = await interfaceInstance.getEvent(encodedTopic);

                if (event.name === eventName) return encodedTopic
            } catch (error) {
                // breaks silently as we do not need to do anything if the there is not such an event
            }

        }
    }

    return ''
}

export async function decodeData(receipt, encodedTopic, paramsArr) {
    const decoder = new ethers.utils.AbiCoder();

    const encodedData = receipt.logs.filter(e => e.topics.includes(encodedTopic))[0].data
    return decoder.decode(paramsArr, encodedData)

}
