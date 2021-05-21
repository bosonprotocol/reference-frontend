import {
  OFFER_FLOW_SCENARIO,
  ROLE,
  STATUS,
} from "../../helpers/configs/Dictionary";

const determineRoleAndStatusOfVoucherResourse = (
  checkAuthentication,
  account,
  voucherDetails,
  voucherSetDetails,
  recentlySignedTxHash,
  hideControlButtonsWaitPeriodExpired
) => {
  const voucherResource = voucherDetails
    ? voucherDetails
    : voucherSetDetails
    ? voucherSetDetails
    : false;

  const voucherRoles = {
    owner:
      voucherResource?.voucherOwner?.toLowerCase() === account?.toLowerCase() &&
      account,
    holder:
      voucherResource?.holder?.toLowerCase() === account?.toLowerCase() &&
      account,
  };

  const draftStatusCheck = !(
    voucherResource?._tokenIdVoucher || voucherResource?._tokenIdSupply
  );

  const statusPropagate = () =>
    draftStatusCheck
      ? STATUS.DRAFT
      : voucherResource.FINALIZED
      ? STATUS.FINALIZED
      : voucherResource.CANCELLED
      ? !voucherResource.COMPLAINED
        ? STATUS.CANCELLED
        : STATUS.COMPLANED_CANCELED
      : voucherResource.COMPLAINED
      ? STATUS.COMPLAINED
      : voucherResource.REFUNDED
      ? STATUS.REFUNDED
      : voucherResource.REDEEMED
      ? STATUS.REDEEMED
      : voucherResource.COMMITTED
      ? STATUS.COMMITED
      : !voucherResource?.qty
      ? STATUS.VIEW_ONLY
      : !voucherResource.COMMITTED
      ? STATUS.OFFERED
      : false;

  const role = voucherRoles.owner
    ? ROLE.SELLER
    : voucherRoles.holder
    ? ROLE.BUYER
    : ROLE.NON_BUYER_SELLER;
  const status = voucherResource && statusPropagate();

  // don't show actions if:
  const blockActionConditions = [
    new Date() >= new Date(voucherResource?.expiryDate), // voucher expired
    new Date() <= new Date(voucherResource?.startDate) && !!voucherDetails, // has future start date and is voucher
    voucherSetDetails?.qty <= 0, // no quantity
    recentlySignedTxHash !== "",
    hideControlButtonsWaitPeriodExpired,
  ];

  if (
    role === ROLE.NON_BUYER_SELLER &&
    checkAuthentication &&
    !voucherSetDetails
  )
    return OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.DISABLED];

  // status: undefined - user that has not logged in
  return !blockActionConditions.includes(true)
    ? OFFER_FLOW_SCENARIO[role][status]
    : undefined;
};
export { determineRoleAndStatusOfVoucherResourse };
