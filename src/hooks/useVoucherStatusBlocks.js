import { useEffect, useState } from "react";
import { STATUS } from "../helpers/configs/Dictionary";
import { formatDate } from "../utils/FormatUtils";
import * as humanizeDuration from "humanize-duration";
import { calculateDifferenceInPercentage } from "../utils/MathUtils";
import { ethers } from "ethers";
import { useVoucherKernalContract } from "./useContract";
import { useWeb3React } from "@web3-react/core";
import { determineCurrentStatusOfVoucher } from "../helpers/parsers/VoucherAndSetParsers";

export const useVoucherStatusBlocks = (
  voucherDetails,
  setHideControlButtonsWaitPeriodExpired
) => {
  const [statusBlocks, setStatusBlocks] = useState(voucherDetails ? [] : false);
  const voucherKernalContract = useVoucherKernalContract();
  const { library } = useWeb3React();

  const resolveWaitPeriodStatusBox = async (newStatusBlocks) => {
    if (
      voucherDetails &&
      !voucherDetails.FINALIZED &&
      voucherDetails._tokenIdVoucher
    ) {
      if (voucherDetails.COMPLAINED && voucherDetails.CANCELLED) {
        return newStatusBlocks;
      }
      const voucherStatus = await voucherKernalContract.vouchersStatus(
        ethers.BigNumber.from(voucherDetails._tokenIdVoucher)
      );
      const currentStatus = determineCurrentStatusOfVoucher(voucherDetails);

      const complainPeriod = await voucherKernalContract.complainPeriod();
      const cancelFaultPeriod = await voucherKernalContract.cancelFaultPeriod();

      const complainPeriodStart = voucherStatus.complainPeriodStart;
      const cancelFaultPeriodStart = voucherStatus.cancelFaultPeriodStart;

      let waitPeriodStart;
      let waitPeriod;

      if (currentStatus.status === STATUS.EXPIRED) {
        waitPeriodStart = voucherDetails.EXPIRED;
        waitPeriod = complainPeriod;
      } else if (!voucherDetails.CANCELLED && !voucherDetails.COMPLAINED) {
        waitPeriodStart = complainPeriodStart;
        waitPeriod = complainPeriod.add(cancelFaultPeriod);
      } else if (voucherDetails.COMPLAINED) {
        waitPeriodStart = cancelFaultPeriodStart;
        waitPeriod = cancelFaultPeriod;
      } else if (voucherDetails.CANCELLED) {
        waitPeriodStart = complainPeriodStart;
        waitPeriod = complainPeriod;
      }

      if (
        (waitPeriod && waitPeriod.gt(ethers.BigNumber.from("0"))) ||
        currentStatus.status === STATUS.COMMITED
      ) {
        const currentBlockTimestamp = (await library.getBlock()).timestamp;

        const start =
          currentStatus.status === STATUS.COMMITED
            ? new Date(voucherDetails.startDate)
            : new Date(
                +ethers.utils.formatUnits(waitPeriodStart, "wei") * 1000
              );
        const end =
          currentStatus.status === STATUS.COMMITED
            ? new Date(voucherDetails.expiryDate)
            : new Date(
                +ethers.utils.formatUnits(
                  waitPeriodStart.add(waitPeriod),
                  "wei"
                ) * 1000
              );
        const now = new Date(currentBlockTimestamp * 1000);

        const timePast = now?.getTime() / 1000 - start?.getTime() / 1000;
        const timeAvailable =
          voucherDetails && end?.getTime() / 1000 - start?.getTime() / 1000;

        const diffInPercentage = calculateDifferenceInPercentage(
          timePast,
          timeAvailable
        );

        if (!(currentStatus === STATUS.EXPIRED) && diffInPercentage >= 100) {
          setHideControlButtonsWaitPeriodExpired(true);
        }
        const expiryProgress = voucherDetails && diffInPercentage + "%";
        document.documentElement.style.setProperty(
          "--progress-percentage",
          expiryProgress
            ? parseInt(diffInPercentage) > 100
              ? "100%"
              : expiryProgress
            : null
        );

        const statusTitle =
          currentStatus.status === STATUS.COMMITED
            ? "Expiration date"
            : "Wait period";
        return [
          ...newStatusBlocks,
          singleStatusComponent({
            title: statusTitle,
            date: end,
            color: 4,
            progress: expiryProgress,
            status: currentStatus.status,
          }),
        ];
      }
    }
    return newStatusBlocks;
  };

  useEffect(() => {
    if (voucherDetails) {
      const resolveStatusBlocks = async () => {
        let newStatusBlocks = [];
        if (!!voucherDetails) {
          if (voucherDetails.COMMITTED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "COMMITED",
                date: voucherDetails.COMMITTED,
                color: 1,
              })
            );
          if (voucherDetails.REDEEMED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "REDEMPTION SIGNED",
                date: voucherDetails.REDEEMED,
                color: 2,
              })
            );
          if (voucherDetails.REFUNDED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "REFUND TRIGGERED",
                date: voucherDetails.REFUNDED,
                color: 5,
              })
            );
          if (voucherDetails.COMPLAINED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "COMPLAINT MADE",
                date: voucherDetails.COMPLAINED,
                color: 3,
              })
            );
          if (voucherDetails.CANCELLED)
            newStatusBlocks.push(
              singleStatusComponent({
                title: "CANCEL OR FAULT ADMITTED",
                date: voucherDetails.CANCELLED,
                color: 4,
              })
            );

          if (newStatusBlocks?.length)
            newStatusBlocks.sort((a, b) => (a.date > b.date ? 1 : -1));

          if (voucherDetails.FINALIZED) {
            newStatusBlocks.push(
              finalStatusComponent(
                !!voucherDetails.REDEEMED,
                !!voucherDetails.COMPLAINED,
                !!voucherDetails.CANCELLED,
                voucherDetails.FINALIZED
              )
            );
          }
        }
        const withWaitPeriodBox = await resolveWaitPeriodStatusBox(
          newStatusBlocks
        );
        setStatusBlocks(withWaitPeriodBox);
      };

      resolveStatusBlocks();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherDetails]);
  return statusBlocks;
};

function singleStatusComponent({ title, date, color, progress, status }) {
  const jsx = (
    <div key={title} className={`status-block color_${color}`}>
      <h3 className="status-name">
        {title}
        {progress ? <div className="progress"></div> : null}
      </h3>
      <p className="status-details">
        {!progress || (progress && status === STATUS.COMMITED)
          ? formatDate(date, "string")
          : `${
              new Date(date).getTime() - new Date().getTime() > 0
                ? humanizeDuration(
                    new Date(date).getTime() - new Date().getTime(),
                    {
                      round: true,
                      largest: 1,
                    }
                  )
                : "Finished"
            }`}
      </p>
    </div>
  );
  return { jsx, date };
}

function finalStatusComponent(
  hasBeenRedeemed,
  hasBeenComplained,
  hasBeenCancelOrFault,
  expiredDate
) {
  const jsx = (
    <div className={`status-block`}>
      <div className="final-status-container">
        {hasBeenRedeemed ? (
          <h3 className="status-name color_1">REDEMPTION</h3>
        ) : (
          <h3 className="status-name color_2">NO REDEMPTION</h3>
        )}
        {hasBeenComplained ? (
          <h3 className="status-name color_3">COMPLAINT</h3>
        ) : (
          <h3 className="status-name color_4">NO COMPLAINT</h3>
        )}
        {hasBeenCancelOrFault ? (
          <h3 className="status-name color_5">CANCEL/FAULT</h3>
        ) : (
          <h3 className="status-name color_6">NO CANCEL/FAULT</h3>
        )}
      </div>
      <p className="status-details">{`Finalised on ${formatDate(
        expiredDate,
        "string"
      )}`}</p>
    </div>
  );
  return { jsx, date: expiredDate };
}
