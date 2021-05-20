import { OFFER_FLOW_SCENARIO, ROLE, STATUS } from "../../helpers/configs/Dictionary";
import ContractInteractionButton from "../../shared-components/contract-interaction/contract-interaction-button/ContractInteractionButton";
import { IconQRScanner } from "../../shared-components/icons/Icons";

export const getControlList = (
    setDisablePage, 
    setShowQRCode,
    confirmAction, 
    onCoF,
    onRefund,
    onComplain,
    onCommitToBuy,
    currencyResolver,
    voucherSetDetails,
    onCancelOrFaultVoucherSet,
    account,
    setTransactionProccessing,
    transactionProccessing,
    setPageLoading
    ) => {
    setDisablePage(0);
    const CASE = {};

    CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.COMMITED]] =
      CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.REFUNDED]] =
      CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.COMPLAINED]] =
      CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.REDEEMED]] =
        () => (
          <div
            className="action button cof"
            onClick={() =>
              confirmAction(onCoF, "Are you sure you want to cancel/fault?")
            }
            role="button"
          >
            Cancel or Fault
          </div>
        );

    CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.COMMITED]] = () => (
      <div className="flex dual split">
        <div
          className="action button refund"
          role="button"
          onClick={() =>
            confirmAction(onRefund, "Are you sure you want to refund?")
          }
        >
          REFUND
        </div>
        <div
          className="action button redeem"
          role="button"
          onClick={() => setShowQRCode(1)}
        >
          <IconQRScanner /> REDEEM
        </div>
        {/* <Link
                    to={ `${ ROUTE.ActivityVouchers }/${ voucherDetails?.id }${ ROUTE.VoucherQRCode }` }>
                </Link> */}
      </div>
    );

    CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REDEEMED]] =
      CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.CANCELLED]] =
      CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.REFUNDED]] =
        () => (
          <div
            className="action button complain"
            role="button"
            onClick={() =>
              confirmAction(onComplain, "Are you sure you want to complain?")
            }
          >
            COMPLAIN
          </div>
        );
    CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.OFFERED]] = CASE[
      OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.OFFERED]
    ] = () => (
      <ContractInteractionButton
        className="action button commit"
        handleClick={() => onCommitToBuy()}
        label={`COMMIT TO BUY ${voucherSetDetails?.price} ${
          currencyResolver(voucherSetDetails?.paymentType)[0]
        }`}
      />
    );

    CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.OFFERED]] = () =>
      voucherSetDetails &&
      voucherSetDetails?.qty > 0 &&
      account?.toLowerCase() ===
        voucherSetDetails.voucherOwner.toLowerCase() ? (
        <div
          className="button cancelVoucherSet"
          onClick={() =>
            confirmAction(
              onCancelOrFaultVoucherSet,
              "Are you sure you want to cancel the voucher set?"
            )
          }
          role="button"
        >
          Void Voucher Set
        </div>
      ) : null;

    CASE[OFFER_FLOW_SCENARIO[ROLE.BUYER][STATUS.DRAFT]] =
      CASE[OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.DRAFT]] =
      CASE[OFFER_FLOW_SCENARIO[ROLE.SELLER][STATUS.DRAFT]] =
        () => {
          setTransactionProccessing(transactionProccessing * -1);
          return (
            <div
              className="button cancelVoucherSet"
              role="button"
              style={{ border: "none" }}
              disabled
              onClick={(e) => e.preventDefault()}
            >
              DRAFT: TRANSACTION IS BEING PROCESSED
            </div>
          );
        };

    CASE[OFFER_FLOW_SCENARIO[ROLE.NON_BUYER_SELLER][STATUS.DISABLED]] = () => {
      setDisablePage(1);
      setPageLoading(0);
      return null;
    };

    return CASE;
  };