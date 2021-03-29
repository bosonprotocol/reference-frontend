export const SMART_CONTRACTS = {
  CashierContractAddress: "0xea58CDbD606212acBf3cFE3866DB50De2779DfED",
  VoucherKernelContractAddress: "0xFf40A5Baa66FaF04Fa27D5C7b5CEc3D3cd12a1d6",
  BosonRouterContractAddress: "0xb7db562e928B74BB1B675BA14f1d95Cb588CC06b",
  BosonTokenContractAddress: "0x5c70A0c47440128eAAA66801B0ec04E9d8C3a570",
  FundLimitsContractAddress: "0xD8F590C2c85A7259e71679CA5D082e040Dab8531",
};

export const SMART_CONTRACTS_EVENTS = {
  VoucherSetCreated: "LogOrderCreated",
  VoucherCreated: "LogVoucherDelivered",
  VoucherRedeemed: "LogVoucherRedeemed",
  VoucherSetCanceled: "LogVoucherSetFaultCancel",
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
