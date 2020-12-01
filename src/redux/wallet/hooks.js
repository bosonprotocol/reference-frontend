import { CurrencyAmount, ETHER, JSBI, Token, TokenAmount } from "@uniswap/sdk";
import { useMemo } from "react";
import ERC20_INTERFACE from "../../constants/abis/erc20";
import { useActiveWeb3React, useAllTokens } from "../../hooks";
import { useMulticallContract } from "../../hooks/useContract";
import { isAddress } from "../../utils";
import {
  useSingleContractMultipleData,
  useMultipleContractSingleData,
} from "../multicall/hooks";

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(uncheckedAddresses) {
  const multicallContract = useMulticallContract();

  const addresses = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a) => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    addresses.map((address) => [address])
  );

  return useMemo(
    () =>
      addresses.reduce((memo, address, i) => {
        const value = results?.[i]?.result?.[0];
        if (value)
          memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()));
        return memo;
      }, {}),
    [addresses, results]
  );
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(address, tokens) {
  const validatedTokens = useMemo(
    () => tokens?.filter((t) => isAddress(t?.address) !== false) ?? [],
    [tokens]
  );

  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  );

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    "balanceOf",
    [address]
  );

  const anyLoading = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances]
  );

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? JSBI.BigInt(value.toString()) : undefined;
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount);
              }
              return memo;
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading,
  ];
}

export function useTokenBalances(address, tokens) {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

// get the balance for a single token/account combo
export function useTokenBalance(account, token) {
  const tokenBalances = useTokenBalances(account, [token]);
  if (!token) return;
  return tokenBalances[token.address];
}

export function useCurrencyBalances(account, currencies) {
  const tokens = useMemo(
    () => currencies?.filter((currency) => currency instanceof Token) ?? [],
    [currencies]
  );

  const tokenBalances = useTokenBalances(account, tokens);
  const containsETH = useMemo(
    () => currencies?.some((currency) => currency === ETHER) ?? false,
    [currencies]
  );
  const ethBalance = useETHBalances(containsETH ? [account] : []);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return;
        if (currency instanceof Token) return tokenBalances[currency.address];
        if (currency === ETHER) return ethBalance[account];
        return;
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  );
}

export function useCurrencyBalance(account, currency) {
  return useCurrencyBalances(account, [currency])[0];
}

// mimics useAllBalances
export function useAllTokenBalances() {
  const { account } = useActiveWeb3React();
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [
    allTokens,
  ]);
  const balances = useTokenBalances(account ?? undefined, allTokensArray);
  return balances ?? {};
}
