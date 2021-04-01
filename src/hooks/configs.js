export const SMART_CONTRACTS = {
  CashierContractAddress: "0x0a9958755fff843987900dE4e2c481294D55d71c",
  VoucherKernelContractAddress: "0x9A0c1Fb3779c2950c8344B09C8A79D993E1AB504",
  BosonRouterContractAddress: "0xcFAC5371dD9936860F9769f4F93b37585fee0a25",
  BosonTokenContractAddress: "0x2Bbba6a961803528700d4B47a586aFA54c2f5D1D",
  FundLimitsContractAddress: "0x997c6b29C3A408d0C17fABD86f920D39CeE7EF92",
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
