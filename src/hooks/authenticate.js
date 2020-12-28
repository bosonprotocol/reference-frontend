import apiService from "../utils/api";
import { splitSignature } from "ethers/lib/utils";
export const AUTH_ADDRESSES_KEY = "authAddresses";
const ARGENT_PEER_NAME = "Argent";

export const authenticateUser = async (library, account, chainId) => {
    const signerAddress = account;

    const nonce = (await apiService.generateNonce(signerAddress)).data;

    const EIP712Domain = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' }
    ];
    const domain = {
        name: 'Boson Protocol',
        version: '1',
        chainId: chainId,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
    };
    const AuthSignature = [
        { name: 'value', type: 'string' },
    ];
    const message = {
        value: `Authentication message: ${ nonce }`
    };
    const data = JSON.stringify({
        types: {
            EIP712Domain,
            AuthSignature
        },
        domain,
        primaryType: 'AuthSignature',
        message
    });

    const isSmartWalletAccount = isSmartWallet(library);

    const signatureLike = await library.send('eth_signTypedData_v4', [account, data]);
    const signature = await splitSignature(signatureLike);

    const jwt = (await apiService.verifySignature(signerAddress, isSmartWalletAccount, domain, { AuthSignature }, signature)).data;

    updateAuthToken(signerAddress, jwt)
};

const isSmartWallet = (library) => {
    return library.provider.connector && library.provider.connector?.peerMeta?.name.includes(ARGENT_PEER_NAME);
};

const updateAuthToken = (userAddress, token, active = true) => {
    let allAddresses = JSON.parse(localStorage.getItem(AUTH_ADDRESSES_KEY));

    const addressToLower = userAddress.toLowerCase();
    let updatedUserInfo = {
        address: addressToLower,
        authToken: token,
        activeToken: active
    };

    if (!Array.isArray(allAddresses)) {
        allAddresses = [updatedUserInfo]
    }

    let updatedLS = [...allAddresses.filter(e => e.address !== addressToLower)];
    updatedLS.push(updatedUserInfo);

    localStorage.setItem(AUTH_ADDRESSES_KEY, JSON.stringify(updatedLS))
};

export const createUnauthenticatedLocalStorageRecord = (accountAddress) => {
    let allAddresses = JSON.parse(localStorage.getItem(AUTH_ADDRESSES_KEY))
    let updatedAddress = {
        address: `${ accountAddress.toLowerCase() }`,
        authToken: '',
        activeToken: false
    };

    if (!Array.isArray(allAddresses)) {
        allAddresses = [updatedAddress]
    }

    if (!allAddresses.some(e => e.address === accountAddress)) {
        allAddresses.push(updatedAddress)
    }

    localStorage.setItem(AUTH_ADDRESSES_KEY, JSON.stringify(allAddresses))
};

export const getAccountStoredInLocalStorage = (userAddress) => {
    let allAddresses = JSON.parse(localStorage.getItem(AUTH_ADDRESSES_KEY));
    if (!userAddress || !Array.isArray(allAddresses)) {
        return ''
    }

    const addressToLower = userAddress.toLowerCase();
    const record = allAddresses.find(e => e.address === addressToLower);
    return record ? record : ''
}
