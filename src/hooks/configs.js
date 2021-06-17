export const SMART_CONTRACTS = {
  CashierContractAddress: "0x6B1141fFF79a96496bbB0673009424BAE1418fa2",
  VoucherKernelContractAddress: "0x7fA35fdF51804cBACEc47502616A2f265d8B8ac0",
  BosonRouterContractAddress: "0x9CBb5bDc5f9aB1f7A97F7b5A0A470BDd20AfCf5b",
  BosonTokenContractAddress: "0x5c70A0c47440128eAAA66801B0ec04E9d8C3a570",
  FundLimitsContractAddress: "0x1Aab8613c27F7DD72B524423081f48b620dF5D20",
};

export const SMART_CONTRACTS_EVENTS = {
  LOG_VOUCHER_DELIVERED: "LogVoucherDelivered",
  LOG_CANCEL_FAULT_VOUCHER_SET: "LogVoucherSetFaultCancel",
  LOG_ORDER_CREATED: "LogOrderCreated",
  LOG_VOUCHER_CANCEL_FAULT: "LogVoucherFaultCancel",
  LOG_VOUCHER_COMPLAIN: "LogVoucherComplain",
  LOG_VOUCHER_REDEEMED: "LogVoucherRedeemed",
  LOG_VOUCHER_REFUNDED: "LogVoucherRefunded",
};

export const VOUCHER_STATUSES = {
  COMMITTED: "COMMITTED",
  REDEEMED: "REDEEMED",
  REFUNDED: "REFUNDED",
  COMPLAINED: "COMPLAINED",
  CANCELLED: "CANCELLED",
  FINALIZED: "FINALIZED",
};

//ToDo: Make it more generic for the next phase, not coupled to BSN.
export const PAYMENT_METHODS = {
  ETHETH: 1,
  ETHBSN: 2,
  BSNETH: 3,
  BSNBSN: 4,
};

export const PAYMENT_METHODS_LABELS = {
  ETHETH: "ETHETH",
  ETHBSN: "ETHBSN",
  BSNETH: "BSNETH",
  BSNBSN: "BSNBSN",
};
