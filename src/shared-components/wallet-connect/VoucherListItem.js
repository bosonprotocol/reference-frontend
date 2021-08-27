import { shortenAddress } from "../../utils/BlockchainUtils";
import { IconSuccessSmall } from "../icons/Icons";
import { formatDate } from "../../utils/FormatUtils";
import { useState } from "react";

export function VoucherListItem({ voucher }) {
  const [dispatched, setDispatched] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [disputed, setDisputed] = useState(false);

  function renderStatusOrNot(status) {
    return "27-Aug-2021";
    if (!status) {
      return "N/A";
    }
    return formatDate(status, "string");
  }

  function renderField(name, value) {
    console.log(value);
    if (value == null) {
      return null;
    }
    return (
      <div className="field">
        <p className="field-name">{name}</p>
        <p>{value}</p>
      </div>
    );
  }

  function renderButtonText(state, value) {
    if (!value) {
      return `Mark as ${state}`;
    }
    return (
      <>
        {state} <IconSuccessSmall />
      </>
    );
  }
  console.log(voucher);
  if (!voucher) {
    return null;
  }

  return (
    <div className="voucher-item relative">
      <div className="voucher-header">
        {renderField("Voucher ID", voucher._id)}
        {renderField("Owner", shortenAddress(voucher.voucherOwner))}
      </div>
      <div className="voucher-item-status">
        {renderField("Cancelled", renderStatusOrNot(voucher.CANCELLED))}
        {renderField("Committed", renderStatusOrNot(voucher.COMMITTED))}
        {renderField("Complained", renderStatusOrNot(voucher.COMPLAINED))}
        {renderField("Expired", renderStatusOrNot(voucher.EXPIRED))}
        {renderField("Finalized", renderStatusOrNot(voucher.FINALIZED))}
        {renderField("Redeemed", renderStatusOrNot(voucher.REDEEMED))}
        {renderField("Refunded", renderStatusOrNot(voucher.REFUNDED))}
      </div>
      <div className="voucher-item-actions">
        {/*<div className="button gray" role="button">*/}
        {/*  Mark as Dispatched*/}
        {/*</div>*/}
        <div
          className={`button gray voucher-item-button ${
            dispatched && "selected"
          }`}
          role="button"
          onClick={() => setDispatched(true)}
        >
          {renderButtonText("Dispatched", dispatched)}
        </div>
        <div
          className={`button gray voucher-item-button ${
            delivered && "selected"
          }`}
          role="button"
          onClick={() => setDelivered(true)}
        >
          {renderButtonText("Delivered", delivered)}
        </div>
        <div
          className={`button gray voucher-item-button ${
            disputed && "selected"
          }`}
          role="button"
          onClick={() => setDisputed(true)}
        >
          {renderButtonText("Disputed", disputed)}
        </div>
      </div>
    </div>
  );
}
