import axios from 'axios';

class ApiService {
    static getInstance() {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }

        return ApiService.instance;
    }

    static instance;
    static axiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: "https://poc-v1-dot-boson-protocol-prototype-test.oa.r.appspot.com"
        })
    }

    async isUserRegistered(address) {
        return await this.axiosInstance.get(`/users/${ address }/is-registered`);
    }

    async createVoucher(data, token) {
        return await this.axiosInstance.post('/vouchers', data, {
                headers: { 'Authorization': `Bearer ${ token }` }
            }
        )
    }

    async updateVoucher(id, data, token) {
        return await this.axiosInstance.patch(`/vouchers/${ id }`, data, {
                headers: { 'Authorization': `Bearer ${ token }` }
            }
        )
    }

    async getVoucher(id) {
        return await this.axiosInstance.get(`/vouchers/${ id }`)
    }

    async getSellerVouchers(userAddress) {
        return await this.axiosInstance.get(`/vouchers/sell/${ userAddress }`)
    }

    async getBuyerVouchers(userAddress) {
        return await this.axiosInstance.get(`/vouchers/buy/${ userAddress }`)
    }

    async getVouchersStatus(token) {
        return await this.axiosInstance.get(`/vouchers/seller-vouchers/status`, {
            headers: { 'Authorization': `Bearer ${ token }` }
        })
    }

    async getActiveVouchers(token) {
        return await this.axiosInstance.get(`/vouchers/seller-vouchers/active`, {
            headers: { 'Authorization': `Bearer ${ token }` }
        })
    }

    async getInactiveVouchers(token) {
        return await this.axiosInstance.get(`/vouchers/seller-vouchers/inactive`, {
            headers: { 'Authorization': `Bearer ${ token }` }
        })
    }

    async getMyVoucherDetails(voucherId, token) {

        return await this.axiosInstance.get(`/user-vouchers/${ voucherId }/voucher-details`, {
            headers: { 'Authorization': `Bearer ${ token }` }
        })
    }

    async getAllUsersByVoucherID(voucherId, token) {
        return await this.axiosInstance.get(`/user-vouchers/buyers/${ voucherId }/`, {
            headers: { 'Authorization': `Bearer ${ token }` }
        })
    }

    async getMyVouchers(token) {
        return await this.axiosInstance.get(`/user-vouchers/`, {
            headers: { 'Authorization': `Bearer ${ token }` }
        })
    }

    async deleteVoucher(id, token) {
        return await this.axiosInstance.delete(`/vouchers/${ id }`, {
                headers: { 'Authorization': `Bearer ${ token }` }
            }
        )
    }

    async deleteImage(id, imageUrl, token) {
        return await this.axiosInstance.delete(`/vouchers/${ id }/image?imageUrl=${ imageUrl }`, {
                headers: { 'Authorization': `Bearer ${ token }` }
            }
        )
    }

    async generateNonce(address) {
        return await this.axiosInstance.post(`/users/${ address }`)
    }

    async verifySignature(address, signature) {
        return await this.axiosInstance.post(`/users/${ address }/verify-signature`, { signature })
    }

    async commitToBuy(voucherID, data, token) {
        return await this.axiosInstance.post(`/users/${ voucherID }/buy`, data, {
            headers: { 'Authorization': `Bearer ${ token }` },
        })
    }

    async updateUserVoucher(data, token) {
        return await this.axiosInstance.patch(`/user-vouchers/update`, data, {
            headers: { 'Authorization': `Bearer ${ token }` },
        })
    }

    async getPaymentDetails(voucherID, token) {
        return await this.axiosInstance.get(`/payments/${ voucherID }`, {
            headers: { 'Authorization': `Bearer ${ token }` },
        })
    }
}

export default ApiService.getInstance();
