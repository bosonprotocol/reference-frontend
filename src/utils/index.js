import { getAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";

export const ChainId = {
    MAINNET: 1,
    ROPSTEN: 3,
    RINKEBY: 4,
    GÖRLI: 5,
    KOVAN: 42,
};

export function shortenAddress(address, chars = 4) {
    const parsed = isAddress(address);
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${ address }'.`);
    }
    return `${ parsed.substring(0, chars + 2) }...${ parsed.substring(42 - chars) }`;
}

export function isAddress(value) {
    try {
        return getAddress(value);
    } catch {
        return false;
    }
}

export const parseLocalStorage = (raw, key) => {
    let parsed = null;
    if (!raw) return null;
    try {
        parsed = JSON.parse(localStorage[key]);
    } catch {
        if (key) console.log(`Invalid localStorage object for "${ key }"`);
    }
    return parsed;
};

// account is not optional
export function getSigner(library, account) {
    return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library, account) {
    return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address, ABI, library, account) {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${ address }'.`);
    }

    return new Contract(address, ABI, getProviderOrSigner(library, account));
}

export function uriToHttp(uri) {
    try {
        const parsed = new URL(uri);
        if (parsed.protocol === "http:") {
            return ["https" + uri.substr(4), uri];
        } else if (parsed.protocol === "https:") {
            return [uri];
        } else if (parsed.protocol === "ipfs:") {
            const hash = parsed.href.match(/^ipfs:(\/\/)?(.*)$/)?.[2];
            return [
                `https://cloudflare-ipfs.com/ipfs/${ hash }/`,
                `https://ipfs.io/ipfs/${ hash }/`,
            ];
        } else if (parsed.protocol === "ipns:") {
            const name = parsed.href.match(/^ipns:(\/\/)?(.*)$/)?.[2];
            return [
                `https://cloudflare-ipfs.com/ipns/${ name }/`,
                `https://ipfs.io/ipns/${ name }/`,
            ];
        } else {
            return [];
        }
    } catch (error) {
        if (uri.toLowerCase().endsWith(".eth")) {
            return [`https://${ uri.toLowerCase() }.link`];
        }
        return [];
    }
}
