export const SMART_CONTRACTS = {
    CashierContractAddress: "0x8e7438b2A825a2ec965825A812d7aF4D1ffA42D9",
    VoucherKernelContractAddress: "0x4c5E939eea7D3Ce167FE5bd2ed3eaDA2dd1535BC",
    BosonRouterContractAddress: "0x06320bC1aE4F01E88FfF12200e7A7c5197C8b713",
    FundLimitsContractAddress: "0x6268619BD38D08077EF2D4f1B335Aa748e8DeFc4",
    BosonTokenDepositContractAddress: "0x10DE49a60C74A8C0c988EF83A2DFABF218ca48E3"
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
