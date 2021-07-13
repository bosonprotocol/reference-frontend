import { IconActivityMessage } from "../shared-components/icons/Icons";
import { WalletConnect } from "../shared-components/wallet-connect/WalletConnect";
import React from "react";

export const VOUCHER_TYPE = {
  accountVoucher: 1,
  voucherSet: 2,
};

export const sortBlocks = (blocksArray, voucherType) => {
  const tabGroup = {
    active: [],
    inactive: [],
  };

  if (voucherType === VOUCHER_TYPE.voucherSet) {
    blocksArray?.forEach((voucherSet) => {
      let quantity = voucherSet.qty > 0;
      let activeVouchers = voucherSet.hasActiveVouchers;
      let expired =
        new Date(voucherSet.expiryDate).getTime() < new Date().getTime();

      !activeVouchers && (!quantity || expired)
        ? tabGroup.inactive.push(voucherSet)
        : tabGroup.active.push(voucherSet);
    });
  } else if (voucherType === VOUCHER_TYPE.accountVoucher) {
    blocksArray?.forEach((voucher) => {
      voucher.FINALIZED
        ? tabGroup.inactive.push(voucher)
        : tabGroup.active.push(voucher);
    });
  }

  return tabGroup;
};

export const getLastAction = (el) => {
  let latest = 0;
  const compareDates = (el) =>
    el
      ? new Date(el).getTime() > latest
        ? new Date(el).getTime()
        : latest
      : latest;

  latest = compareDates(el.CANCELLED);
  latest = compareDates(el.COMMITTED);
  latest = compareDates(el.COMPLAINED);
  latest = compareDates(el.EXPIRED);
  latest = compareDates(el.FINALIZED);
  latest = compareDates(el.REDEEMED);
  latest = compareDates(el.REFUNDED);

  return latest;
};

export const activityMessageType = {
  [VOUCHER_TYPE.accountVoucher]: {
    active: "active vouchers.",
    inactive: "inactive vouchers.",
  },
  [VOUCHER_TYPE.voucherSet]: {
    active: "open voucher sets.",
    inactive: "closed voucher sets.",
  },
};

export const activityMessage = (message, account) => {
  return account ? (
    <div className="no-vouchers flex column center">
      <p>You currently have no {message}</p>
      <IconActivityMessage />
    </div>
  ) : (
    <div className="no-vouchers flex column center">
      <p>
        <strong>No wallet connected.</strong> <br /> Connect to a wallet to view
        your vouchers.
      </p>
      <WalletConnect />
    </div>
  );
};

export const activityBlockPlaceholder = (
  <div className="placeholder-parent">
    <div className="block plceholder is-loading"></div>
  </div>
);
