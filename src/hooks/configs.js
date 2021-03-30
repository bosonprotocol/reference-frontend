export const SMART_CONTRACTS = {
    CashierContractAddress: "0xcdF2dd01f20F0e1844CE23d17895E986dad39f18",
    VoucherKernelContractAddress: "0xD3EB292E3D3261f836b4de0b8E446d127aa14d64",
    BosonRouterContractAddress: "0xe23dF284c115daD7028d18Dd502b54Ea30AB1e2e",
    BosonTokenContractAddress: "0x2Bbba6a961803528700d4B47a586aFA54c2f5D1D",
    FundLimitsContractAddress: "0xfe5c5aB6764Bf161313434BCa9747F63B629B566",
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
