export const SMART_CONTRACTS = {
  CashierContractAddress: "0x0bfF7B7A04C1eB19DeA63f0FF4D884914edB61E8",
  VoucherKernelContractAddress: "0x82a33733c2f8696F7fd61D0874351cbb8Ea61EBc",
  BosonRouterContractAddress: "0x29C9361920785F4B2175Ba61c177cEdC6A99542A",
  BosonTokenContractAddress: "0x1b48e27D7ABaDf2f5A5f14975Cb9D4E457dF5111",
  FundLimitsContractAddress: "0x4d827187dD0df5bF02575d24E5586e765511596e",
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
