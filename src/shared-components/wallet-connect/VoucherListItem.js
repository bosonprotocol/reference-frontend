import { shortenAddress } from "../../utils/BlockchainUtils";
import { IconSuccessSmall } from "../icons/Icons";
import { formatDate } from "../../utils/FormatUtils";
import { useState } from "react";
import "../wallet-connect/WalletConnect.scss";
import { useEffect, useRef } from "react/cjs/react.development";

export function VoucherListItem({ voucher }) {
  const [dispatched, setDispatched] = useState(!!voucher.DISPATCHED);
  const [delivered, setDelivered] = useState(!!voucher.DELIVERED);
  const [disputed, setDisputed] = useState(!!voucher.DISPUTED);
  const [statusChanged, setStatus] = useState(false);

  const initialParams = {
    dispatched: !!voucher.DISPATCHED,
    delivered: !!voucher.DELIVERED,
    disputed: !!voucher.DISPUTED,
  };

  const currentParams = {
    dispatched,
    delivered,
    disputed,
  };

  useEffect(() => {
    if (
      initialParams?.dispatched !== currentParams?.dispatched ||
      initialParams?.delivered !== currentParams?.delivered ||
      initialParams?.disputed !== currentParams?.disputed
    ) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [dispatched, delivered, disputed]);

  function renderStatusOrNot(status) {
    if (!status) {
      return "-";
    }
    return formatDate(status, "string");
  }

  function renderButtonText(state, value) {
    if (!value) {
      return <IconSuccessSmall color={"#D3D3D3"} opacity={"0.25"} />;
    }
    return <IconSuccessSmall />;
  }

  if (!voucher) {
    return null;
  }

  return (
    <tr>
      <td>
        <a href={`http://localhost:3001/vouchers/${voucher._id}/details`}>
          {voucher._id}
        </a>
      </td>
      <td>{shortenAddress(voucher.voucherOwner)}</td>
      <td>{renderStatusOrNot(voucher.COMMITTED)}</td>
      <td>{renderStatusOrNot(voucher.REFUNDED)}</td>
      <td>{renderStatusOrNot(voucher.REDEEMED)}</td>
      <td>{renderStatusOrNot(voucher.COMPLAINED)}</td>
      <td>{renderStatusOrNot(voucher.FINALIZED)}</td>
      <td>{renderStatusOrNot(voucher.EXPIRED)}</td>
      <td>{renderStatusOrNot(voucher.CANCELLED)}</td>
      <td
        className="customizable"
        style={{ verticalAlign: "bottom" }}
        onClick={() => {
          setDispatched((prevValue) => {
            return !prevValue;
          });
        }}
      >
        {renderButtonText("Dispatched", dispatched)}
      </td>
      <td
        className="customizable"
        style={{ verticalAlign: "bottom" }}
        onClick={() => {
          setDelivered((prevValue) => {
            return !prevValue;
          });
        }}
      >
        {renderButtonText("Delivered", delivered)}
      </td>
      <td
        className="customizable"
        style={{ verticalAlign: "bottom" }}
        onClick={() => {
          setDisputed((prevValue) => {
            return !prevValue;
          });
        }}
      >
        {renderButtonText("Disputed", disputed)}
      </td>
      <td className="td-save">
        <button className="button" role="button" disabled={!statusChanged}>
          SAVE
        </button>
      </td>
    </tr>
  );
}
