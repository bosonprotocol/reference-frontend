/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { GlobalContext, Action } from "../../../contexts/Global";
import "react-tabs/style/react-tabs.css";
import { PurchasedVouchers } from "./PurchasedVouchers";
import { VoucherSetBlock } from "./OfferedVoucherSets";

export function VoucherSetSupplyView() {
  const history = useHistory();
  const globalContext = useContext(GlobalContext);
  const locationPath = history.location.pathname.split("/");

  const [voucherSetId, setVoucherSetId] = useState();
  const [block, setBlock] = useState();

  useEffect(() => {
    globalContext.dispatch(Action.fetchVoucherSets());
  }, []);

  useEffect(() => {
    const getVoucherSet = globalContext.state.allVoucherSets?.find(
      (voucher) => voucher.id === voucherSetId
    );

    setVoucherSetId(locationPath[locationPath.length - 2]);
    setBlock(getVoucherSet);
  }, [globalContext.state.allVoucherSets, voucherSetId]);

  return (
    <section className="activity atomic-scoped">
      <div className="voucher-set-container container">
        <VoucherSetBlock {...block} key={voucherSetId} openDetails />
        <PurchasedVouchers
          block={block}
          voucherSetId={voucherSetId}
          title="Vouchers"
        />
      </div>
    </section>
  );
}
