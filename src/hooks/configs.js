export const SMART_CONTRACTS = {
    CashierContractAddress: "0xEFd19C52387c5bdA06f7e7DdC1897670F1B7192d",
    VoucherKernelContractAddress: "0xb8aaB370cF5202501b73A3dC1E0c28E9a6876A27",
};

export const SMART_CONTRACTS_EVENTS = {
    VoucherSetCreated: "LogOrderCreated",
    VoucherCreated: "LogVoucherDelivered",
    VoucherRedeemed: "LogVoucherRedeemed"
};

export const VOUCHER_STATUSES = {
    COMMITTED: "COMMITTED",
    REDEEMED: "REDEEMED",
    REFUNDED: "REFUNDED",
    COMPLAINED: "COMPLAINED",
    CANCELLED: "CANCELLED",
    FINALIZED: "FINALIZED"
};
