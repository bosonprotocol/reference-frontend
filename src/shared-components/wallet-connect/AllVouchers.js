import { getAllVouchers } from "../../hooks/api";
import React, { useEffect, useState } from "react";
import "./AllVouchers.scss";
import { VoucherListItem } from "./VoucherListItem";
import BetaIcon from "../../views/voucher-and-set-details/components/icons/betaIcon/BetaIcon";

export function AllVouchers() {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const getVouchers = async () => {
      const vouchers = await getAllVouchers();
      setVouchers(vouchers);
    };
    getVouchers();
  }, []);

  return (
    <div className="all-vouchers-container">
      <h1>
        Manage Orders <BetaIcon />
      </h1>
      <table className="all-vouchers-table">
        <thead>
          <tr>
            <th>Voucher ID</th>
            <th>Owner</th>
            <th>Committed</th>
            <th>Refunded</th>
            <th>Redeemed</th>
            <th>Complained</th>
            <th>Finalized</th>
            <th>Expired</th>
            <th>Cancelled</th>
            <th>Dispatched</th>
            <th>Delivered</th>
            <th>Disputed</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => {
            return <VoucherListItem voucher={voucher} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
