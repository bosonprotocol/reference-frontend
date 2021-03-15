import { useMemo } from 'react'
import { useWeb3React } from "@web3-react/core";
import { getContract } from "../utils";
import { SMART_CONTRACTS } from "./configs";
import BOSON_ROUTER_ABI from './ABIs/BosonRouter.json';
import FUND_LIMITS from './ABIs/FundLimitsOracle.json';
import VOUCHER_KERNEL from './ABIs/VoucherKernel.json'

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
    return useContract(SMART_CONTRACTS.BosonRouterContractAddress, BOSON_ROUTER_ABI.abi)
}

export function useFundLimitsContract() {
    return useContract(SMART_CONTRACTS.FundLimitsContractAddress, FUND_LIMITS.abi)
}

export function useVoucherKernalContract() {
    return useContract(SMART_CONTRACTS.VoucherKernelContractAddress, VOUCHER_KERNEL.abi)
}