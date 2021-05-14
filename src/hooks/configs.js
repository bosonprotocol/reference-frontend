export const SMART_CONTRACTS = {
  CashierContractAddress: "0xC69cEE198054F67794D08163fD1bDD9BDABd5C09",
  VoucherKernelContractAddress: "0x0AC643622800ebC588d038104919485b39F741d6",
  BosonRouterContractAddress: "0xec84DED4cFddbcf344a1F21Eb5dd45fb92597326",
  BosonTokenContractAddress: "0x5c70A0c47440128eAAA66801B0ec04E9d8C3a570",
  FundLimitsContractAddress: "0xdeC1c58D4fac6c479F2c65Caf482d51384C934cA",
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
