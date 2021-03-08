import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL
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

export const getVouchers = async (token) => {
    const allVouchers = await axiosInstance.get(`/vouchers`, {
        headers: { 'Authorization': `Bearer ${ token }` }
    });
    return allVouchers.data;
};

export const getVoucherDetails = async (voucherId, token) => {
    const voucherDetails = await axiosInstance.get(`/vouchers/${ voucherId }/voucher-details`, {
        headers: { 'Authorization': `Bearer ${ token }` }
    });

    return voucherDetails.data
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

export const commitToBuy = async (supplyId, data, token) => {
    const allVouchers = await axiosInstance.post(`/vouchers/commit-to-buy/${ supplyId }`, data, {
        headers: { 'Authorization': `Bearer ${ token }` }
    });
    return allVouchers.data;
};

export const updateVoucher = async (data, token) => {
    const redeemResponse = await axiosInstance.patch(`/vouchers/update`, data, {
        headers: { 'Authorization': `Bearer ${ token }` }
    });

    return redeemResponse.data;
};

export const getPaymentsDetails = async (tokenVoucherId, token) => {
    const paymentsResponse = await axiosInstance.get(`/payments/${ tokenVoucherId }`, {
        headers: { 'Authorization': `Bearer ${ token }` }
    });

    return paymentsResponse.data;
};

export const cancelVoucherSet = async (supplyId, account, data, token) => {
     return axiosInstance.patch(`/voucher-sets/update-supply-oncancel-intermediary`, {
        _tokenIdSupply:supplyId,
        voucherOwner: account,
        qty: 0
    }, {
        headers: { 'Authorization': `Bearer ${ token }` }
    });
};

export const getAccountVoucherSets = async (account) => {
    const accountVoucherSets = await axiosInstance.get(`/voucher-sets/sell/${account}`)
    console.log(accountVoucherSets)
    return accountVoucherSets.data;
};

export const getVouchersFromSupply = async (address, token) => {
    const vouchersFromSupply = await axiosInstance.get(`/vouchers/buyers/${address}`, {
        headers: { 'Authorization': `Bearer ${ token }` }
    })
    return vouchersFromSupply.data;
};