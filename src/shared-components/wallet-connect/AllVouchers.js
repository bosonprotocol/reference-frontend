import { getAllVouchers } from "../../hooks/api";
import React, { useEffect, useState } from "react";
import "./AllVouchers.scss";
import { VoucherListItem } from "./VoucherListItem";

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
      <h1>Vouchers</h1>
      <div className="flex" style={{ gridGap: "20px" }}>
        {vouchers.map((voucher) => {
          return <VoucherListItem voucher={voucher} />;
        })}
      </div>
    </div>
  );
}
