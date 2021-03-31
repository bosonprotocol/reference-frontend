export const SMART_CONTRACTS = {
    CashierContractAddress: "0x137b83744B00d118A14A7CaE22399c0CC4Cfbc7F",
    VoucherKernelContractAddress: "0xB49a421Ef38b51AD4F72eD125c97aB005c8f6c68",
    BosonRouterContractAddress: "0x3ff6b11F3f61b866Ea7AADFb594BF3874F3848AC",
    BosonTokenContractAddress: "0x2Bbba6a961803528700d4B47a586aFA54c2f5D1D",
    FundLimitsContractAddress: "0x55F349c0FeC03AB41DC5B61B7722cA2FB58d77d8",
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
