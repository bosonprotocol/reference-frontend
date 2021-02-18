export const SMART_CONTRACTS = {
    CashierContractAddress: "0xfFCCfC789bCB40f710395d9d7D79A30872890719",
    VoucherKernelContractAddress: "0xc83898EcB7D4295B34f11E2048aC0BDD9E46A610",
    BosonRouterContractAddress: "0x32479F86c5B64d44655419b6AF787e46A5F89b4a"
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
