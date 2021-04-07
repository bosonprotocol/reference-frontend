export const SMART_CONTRACTS = {
  CashierContractAddress: "0x05Da8A41b730fD6BeAcB4eb79635b93770652484",
  VoucherKernelContractAddress: "0x166eCd96Ec7E977bf74526BDC2E35B0DCC1CF5a7",
  BosonRouterContractAddress: "0xAcaC4421ab76B71b195A8d70F9Cab6a23CD44cF4",
  BosonTokenContractAddress: "0x5c70A0c47440128eAAA66801B0ec04E9d8C3a570",
  FundLimitsContractAddress: "0x853AfbD97Cbce327D2D4274c3a62B20983E94228",
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
