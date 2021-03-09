export const SMART_CONTRACTS = {
    CashierContractAddress: "0x23744592d099fA701C7885a37F5EC0a0288f608d",
    VoucherKernelContractAddress: "0xCd6818d44D439F3FAcE06cEE87e67D82d929391B",
    BosonRouterContractAddress: "0x4F412F601Ae23f99Dc310418CC98996F798a3FcC",
    BosonTokenContractAddress: "0x5c70A0c47440128eAAA66801B0ec04E9d8C3a570",
    FundLimitsContractAddress: "0x42F535F883A90E16Df422B238A318cf0d3903267",
};

export const SMART_CONTRACTS_EVENTS = {
    VoucherSetCreated: "LogOrderCreated",
    VoucherCreated: "LogVoucherDelivered",
    VoucherRedeemed: "LogVoucherRedeemed",
    VoucherSetCanceled: "LogVoucherSetFaultCancel"
};

export const VOUCHER_STATUSES = {
    COMMITTED: "COMMITTED",
    REDEEMED: "REDEEMED",
    REFUNDED: "REFUNDED",
    COMPLAINED: "COMPLAINED",
    CANCELLED: "CANCELLED",
    FINALIZED: "FINALIZED"
};


//ToDo: Make it more generic for the next phase, not coupled to BSN.
export const PAYMENT_METHODS = {
    ETHETH: 1,
    ETHBSN: 2,
    BSNETH: 3,
    BSNBSN: 4
};

export const PAYMENT_METHODS_LABELS = {
    ETHETH: "ETHETH",
    ETHBSN: "ETHBSN",
    BSNETH: "BSNETH",
    BSNBSN: "BSNBSN"
};
