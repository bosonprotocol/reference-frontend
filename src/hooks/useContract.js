import { useMemo } from 'react'
import { useWeb3React } from "@web3-react/core";
import { getContract } from "../utils";
import { SMART_CONTRACTS } from "./configs";
import BOSON_ROUTER_ABI from './ABIs/BosonRouter.json';
import BOSON_TOKEN_DEPOSIT from './ABIs/BosonToken.json';
import BOSON_ROUTER from './ABIs/BosonRouter.json'
import VOUCHER_KERNEL from './ABIs/VoucherKernel.json'
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

export function useBosonRouterContract() {
    return useContract(SMART_CONTRACTS.BosonRouterContractAddress, BOSON_ROUTER.abi)
}
export function useVoucherKernalContract() {
    return useContract(SMART_CONTRACTS.VoucherKernelContractAddress, VOUCHER_KERNEL.abi)
}
export function useBosonTokenDepositContract() {
    return useContract(SMART_CONTRACTS.BosonTokenDepositContractAddress, BOSON_TOKEN_DEPOSIT.abi)
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
export async function getApprovalDigest(
    token,
    owner,
    spender,
    value,
    nonce,
    deadline,
    chainId
  ) {
    const name = await token.name();
    const DOMAIN_SEPARATOR = getDomainSeparator(name, token.address, chainId);

    
    const PERMIT_TYPEHASH = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(
          'Permit(' +
            'address owner,' +
            'address spender,' +
            'uint256 value,' +
            'uint256 nonce,' +
            'uint256 deadline)'
        )
      );
    return ethers.utils.keccak256(
        ethers.utils.solidityPack(
        ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
        [
          '0x19',
          '0x01',
          DOMAIN_SEPARATOR,
          ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
              ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
              [
                PERMIT_TYPEHASH,
                owner,
                spender,
                value.toString(),
                nonce.toString(),
                deadline,
              ]
            )
          ),
        ]
      )
    );
  }

  export function toWei (value) {
    return value + '0'.repeat(18);
};

  function getDomainSeparator(name, tokenAddress, chainId) {
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
        [
            ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes(
              'EIP712Domain(' +
                'string name,' +
                'string version,' +
                'uint256 chainId,' +
                'address verifyingContract)'
            )
          ),
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name)),
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes('1')),
          chainId,
          tokenAddress,
        ]
      )
    );
  }