import { WETH } from "@uniswap/sdk";
import { useMemo } from "react";
import { ERC20_BYTES32_ABI } from "../constants/abis/erc20";
import ERC20_ABI from "../constants/abis/erc20.json";
import WETH_ABI from "../constants/abis/weth.json";
import { MULTICALL_ABI, MULTICALL_NETWORKS } from "../constants/multicall";
// import { getContract } from "../utils";
import { useActiveWeb3React } from "./index";

// // returns null on errors
// function useContract(address, ABI, withSignerIfPossible = true) {
//     const { library, account } = useActiveWeb3React();
//
//     return useMemo(() => {
//         if (!address || !ABI || !library) return null;
//         try {
//             return getContract(
//                 address,
//                 ABI,
//                 library,
//                 withSignerIfPossible && account ? account : undefined
//             );
//         } catch (error) {
//             console.error("Failed to get contract", error);
//             return null;
//         }
//     }, [address, ABI, library, withSignerIfPossible, account]);
// }

// export function useTokenContract(tokenAddress, withSignerIfPossible) {
//     return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
// }
//
// export function useWETHContract(withSignerIfPossible) {
//     const { chainId } = useActiveWeb3React();
//     return useContract(
//         chainId ? WETH[chainId].address : undefined,
//         WETH_ABI,
//         withSignerIfPossible
//     );
// }
//
// export function useBytes32TokenContract(tokenAddress, withSignerIfPossible) {
//     return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
// }
//
// export function useMulticallContract() {
//     const { chainId } = useActiveWeb3React();
//     return useContract(
//         chainId && MULTICALL_NETWORKS[chainId],
//         MULTICALL_ABI,
//         false
//     );
// }
