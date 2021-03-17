export const SMART_CONTRACTS = {
    CashierContractAddress: "0x804bD23de6337d32b55F6eB711A69F9Ff3929544",
    VoucherKernelContractAddress: "0x4321300118BB6Bb42c1025F84c5FbD0Ba818A932",
    BosonRouterContractAddress: "0x055fe7ad69F3e37bca2Cced75879b975484cDFA9",
    FundLimitsContractAddress: "0x50F0c315D460F1ce3708b008A6B7327F8Fd0EA49",
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
