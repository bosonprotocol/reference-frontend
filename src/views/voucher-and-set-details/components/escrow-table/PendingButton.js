import { IconClock } from "../../../../shared-components/icons/Icons";

const PendingButton = ()=> (
    <div className="pending-button-holder" data-config="button">
    <div
      className="button cancelVoucherSet pending-button"
      role="button"
      disabled
      onClick={(e) => e.preventDefault()}
    >
      <div>
        <span
          style={{
            verticalAlign: "middle",
            display: "inline-block",
          }}
        >
          <IconClock color={"#E49043"} />
        </span>
        <span
          style={{
            verticalAlign: "middle",
            display: "inline-block",
            fontSize: "1.1em",
            color: "white",
          }}
        >
          &nbsp;PENDING
        </span>
      </div>
    </div>
  </div>
);
export default PendingButton