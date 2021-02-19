export const SMART_CONTRACTS = {
    CashierContractAddress: "0x23744592d099fA701C7885a37F5EC0a0288f608d",
    VoucherKernelContractAddress: "0xCd6818d44D439F3FAcE06cEE87e67D82d929391B",
    BosonRouterContractAddress: "0x4F412F601Ae23f99Dc310418CC98996F798a3FcC",
    FundLimitsContractAddress: "0x42F535F883A90E16Df422B238A318cf0d3903267",
    BosonTokenDepositContractAddress: "0x10DE49a60C74A8C0c988EF83A2DFABF218ca48E3"
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
