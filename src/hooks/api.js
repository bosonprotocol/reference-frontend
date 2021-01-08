import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://psyched-hook-280010.oa.r.appspot.com"
});

export const generateNonce = async (address) => {
    const nonce = await axiosInstance.post(`/users/${ address }`);
    return nonce.data;
};

export const verifySignature = async (address, isSmartWallet, domain, types, signature) => {
    const jwtResponse = await axiosInstance.post(`/users/${ address }/verify-signature`, {
        address,
        isSmartWallet,
        domain,
        types,
        signature
    })

    return jwtResponse.data;
};

export const getAllVouchers = async () => {
    const allVouchers = await axiosInstance.get(`/vouchers/public`);
    return allVouchers.data;
};

export const getAllVoucherSets = async () => {
    const allVoucherSets = await axiosInstance.get(`/voucher-sets`);
    return allVoucherSets.data;
};

export const createVoucherSet = async (data, token) => {
    const allVouchers = await axiosInstance.post(`/voucher-sets`, data, {
        headers: { 'Authorization': `Bearer ${ token }` }
    });
    return allVouchers.data;
};