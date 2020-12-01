import { Token } from "@uniswap/sdk";
import { ChainId } from "../../utils";
import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
    constructor(tokenInfo) {
        super(
            tokenInfo.chainId,
            tokenInfo.address,
            tokenInfo.decimals,
            tokenInfo.symbol,
            tokenInfo.name
        );
        this.tokenInfo = tokenInfo;
    }

    logoURI() {
        return this.tokenInfo.logoURI;
    }
}

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST = {
    [ChainId.KOVAN]: {},
    [ChainId.RINKEBY]: {},
    [ChainId.ROPSTEN]: {},
    [ChainId.GÖRLI]: {},
    [ChainId.MAINNET]: {},
};

const listCache = "WeakMap" in window ? new WeakMap() : null;

export function listToTokenMap(list) {
    const result = listCache?.get(list);
    if (result) return result;
    const panTokenData = [
        {
            name: "Panvala pan",
            address: "0xd56dac73a4d6766464b38ec6d91eb45ce7457c44",
            symbol: "PAN",
            tags: ["bases"],
            decimals: 18,
            chainId: 1,
            logoURI:
                "https://raw.githubusercontent.com/trustwallet/assets/887ff8d14ec512a1906e03f9dd4222fcedb436e7/blockchains/ethereum/assets/0xd56dac73a4d6766464b38ec6d91eb45ce7457c44/logo.png",
        },
        {
            name: "Panvala pan",
            address: "0x9288d35edd66a2979a55ff2ee31ad02940a03c5c",
            symbol: "PAN",
            tags: ["bases"],
            decimals: 18,
            chainId: 4,
            logoURI:
                "https://raw.githubusercontent.com/trustwallet/assets/887ff8d14ec512a1906e03f9dd4222fcedb436e7/blockchains/ethereum/assets/0xd56dac73a4d6766464b38ec6d91eb45ce7457c44/logo.png",
        },
    ];
    const tokenDataList = list.tokens.concat(panTokenData);
    const map = tokenDataList.reduce(
        (tokenMap, tokenInfo) => {
            const token = new WrappedTokenInfo(tokenInfo);
            if (tokenMap[token.chainId][token.address] !== undefined)
                throw Error("Duplicate tokens.");
            return {
                ...tokenMap,
                [token.chainId]: {
                    ...tokenMap[token.chainId],
                    [token.address]: token,
                },
            };
        },
        { ...EMPTY_LIST }
    );
    listCache?.set(list, map); // eslint-disable-line no-unused-expressions
    return map;
}

export function useTokenList(url) {
    const lists = useSelector((state) => state.lists.byUrl);
    return useMemo(() => {
        const current = lists[url]?.current;
        if (!current) return EMPTY_LIST;
        return listToTokenMap(current);
    }, [lists, url]);
}

// returns all downloaded current lists
export function useAllLists() {
    const lists = useSelector((state) => state.lists.byUrl);

    return useMemo(
        () =>
            Object.keys(lists)
                .map((url) => lists[url].current)
                .filter((l) => Boolean(l)),
        [lists]
    );
}
