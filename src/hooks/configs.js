export const SMART_CONTRACTS = {
  CashierContractAddress: "0xc5701331cf35EED5950CF770fd3316c1402C57f3",
  VoucherKernelContractAddress: "0x43A3Df919d5918bbB6300Fd2c20cCBF54221972e",
  BosonRouterContractAddress: "0x55C7461087e476a1EE094847EE2401B26559FADC",
  BosonTokenContractAddress: "0x5c70A0c47440128eAAA66801B0ec04E9d8C3a570",
  FundLimitsContractAddress: "0xB8bC8cc8e6531F55a79d1aa3Af3ec57FbEd38e71",
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
