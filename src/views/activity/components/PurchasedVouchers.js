import React, { useContext, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ModalContext } from "../../../contexts/Modal";
import {
  getAccountVouchers,
  getParsedVouchersFromSupply,
} from "../../../helpers/parsers/VoucherAndSetParsers";
import {
  activityBlockPlaceholder,
  activityMessage,
  activityMessageType,
  getLastAction,
  sortBlocks,
  VOUCHER_TYPE,
} from "../../../helpers/ActivityHelper";
import { GlobalContext } from "../../../contexts/Global";
import { IconBsn, IconEth } from "../../../shared-components/icons/Icons";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { QUERY_PARAMS, ROUTE } from "../../../helpers/configs/Dictionary";
import { Link } from "react-router-dom";

import "./../Activity.scss";
import { formatDate } from "../../../utils/FormatUtils";

export function PurchasedVouchers({ title, voucherSetId, block }) {
  const [accountVouchers, setAccountVouchers] = useState(undefined);
  const { account } = useWeb3React();
  const modalContext = useContext(ModalContext);
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    setLoading(1);

    getAccountVouchers(account, modalContext).then((result) => {
      setLoading(0);
      setAccountVouchers(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <PurchasedView
      block={block}
      voucherSetId={voucherSetId}
      title={title ? title : false}
      loading={loading}
      voucherBlocks={accountVouchers}
      account={account}
      voucherType={VOUCHER_TYPE.accountVoucher}
    />
  );
}

function PurchasedView(props) {
  const { voucherBlocks, voucherType, account, title, voucherSetId, block } =
    props;
  const globalContext = useContext(GlobalContext);

  const [resultVouchers, setResultVouchers] = useState(undefined);
  const [activeVouchers, setActiveVouchers] = useState([]);
  const [inactiveVouchers, setInactiveVouchers] = useState([]);
  const [pageLoading, setPageLoading] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem("isAuthenticated"))
  );

  useEffect(() => {
    setPageLoading(1);
  }, []);

  useEffect(() => {
    if (voucherSetId) {
      getParsedVouchersFromSupply(voucherSetId, account).then((result) => {
        if (result) {
          let extendedResults = result.vouchers;
          extendedResults.map((voucher) => {
            voucher["image"] = "/images/voucher_scan.png";
            voucher["expiryDate"] = block?.expiryDate;
            return voucher;
          });

          setResultVouchers(extendedResults);
        }
      });
    }
  }, [account, block]);

  useEffect(() => {
    if (voucherBlocks?.length && !voucherSetId)
      setResultVouchers(voucherBlocks);
  }, [voucherBlocks, account]);

  useEffect(() => {
    const sortVouchersToActiveAndInactive = async () => {
      const blocksSorted = sortBlocks(
        resultVouchers,
        voucherType,
        globalContext
      );

      setActiveVouchers(
        blocksSorted.active?.sort((a, b) =>
          getLastAction(a) > getLastAction(b) ? -1 : 1
        )
      );
      setInactiveVouchers(
        blocksSorted.inactive?.sort((a, b) =>
          getLastAction(a) > getLastAction(b) ? -1 : 1
        )
      );
      if (account && isAuthenticated && Array.isArray(voucherBlocks)) {
        setPageLoading(0);
      }
    };

    sortVouchersToActiveAndInactive();
  }, [resultVouchers, voucherBlocks]);

  useEffect(() => {
    if (account) {
      setIsAuthenticated(true);
    }
  }, [account]);

  useEffect(() => {
    if (!isAuthenticated && isAuthenticated !== undefined) {
      setPageLoading(0);
    }
  }, [isAuthenticated]);

  return (
    <>
      <section className="activity atomic-scoped">
        <div className="container voucher-container">
          <div className="page-title">
            <h1>{title ? title : "Purchased"}</h1>
          </div>
          {
            <Tabs>
              <TabList>
                <Tab>{"Active"}</Tab>
                <Tab>{"Inactive"}</Tab>
              </TabList>
              <>
                <TabPanel>
                  {!pageLoading ? (
                    activeVouchers?.length > 0 && !!account ? (
                      <PurchasedTab
                        voucherSetId={voucherSetId && voucherSetId}
                        voucherType={voucherType}
                        products={activeVouchers}
                      />
                    ) : (
                      activityMessage(
                        activityMessageType[VOUCHER_TYPE.accountVoucher].active,
                        account
                      )
                    )
                  ) : (
                    activityBlockPlaceholder
                  )}
                </TabPanel>
                <TabPanel>
                  {!pageLoading ? (
                    inactiveVouchers?.length > 0 && !!account ? (
                      <PurchasedTab
                        voucherSetId={voucherSetId && voucherSetId}
                        voucherType={voucherType}
                        products={inactiveVouchers}
                      />
                    ) : (
                      activityMessage(
                        activityMessageType[VOUCHER_TYPE.accountVoucher]
                          .inactive,
                        account
                      )
                    )
                  ) : (
                    activityBlockPlaceholder
                  )}
                </TabPanel>
              </>
            </Tabs>
          }
        </div>
      </section>
    </>
  );
}

export const PurchasedTab = (props) => {
  const { products, voucherSetId } = props;

  return (
    <div className="voucher-set-container">
      {products.map((voucher, id) => (
        <SingleVoucherBlock voucherSetId={voucherSetId} {...voucher} key={id} />
      ))}
    </div>
  );
};

export const SingleVoucherBlock = (props) => {
  const {
    voucherSetId,
    title,
    image,
    price,
    id,
    _id,
    expiryDate,
    COMMITTED,
    REDEEMED,
    REFUNDED,
    COMPLAINED,
    CANCELLED,
    FINALIZED,
    paymentType,
  } = props;

  // const [currency, setCurrency]
  const statusOrder = {
    COMMITTED: new Date(COMMITTED).getTime(),
    REDEEMED: new Date(REDEEMED).getTime(),
    REFUNDED: new Date(REFUNDED).getTime(),
    COMPLAINED: new Date(COMPLAINED).getTime(),
    CANCELLED: new Date(CANCELLED).getTime(),
  };

  const statuses = statusOrder
    ? Object.entries(statusOrder)
        .sort(([, a], [, b]) => a - b)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
    : null;

  const currency = paymentType === 1 || paymentType === 2 ? "ETH" : "BSN";
  const currencyIcon =
    paymentType === 1 || paymentType === 2 ? <IconEth /> : <IconBsn />;

  const refVoucherSetIdParam = voucherSetId
    ? `?${QUERY_PARAMS.VOUCHER_SET_ID}=${voucherSetId}`
    : "";

  return (
    <div className={`voucher-block flex ${voucherSetId ? "supply" : ""}`}>
      <Link
        to={`${ROUTE.ActivityVouchers}/${voucherSetId ? _id : id}${
          ROUTE.Details
        }${refVoucherSetIdParam}`}
      >
        {!voucherSetId ? (
          <div className="thumb no-shrink">
            <img src={image} alt={title} />
          </div>
        ) : null}
        <div
          className={`info grow flex ${
            !voucherSetId ? "jc-sb voucher-set-info" : ""
          } column`}
        >
          <div className="title-container">
            {!voucherSetId ? (
              <div className="status">
                <p>VOUCHER</p>
              </div>
            ) : null}
            <div className="title elipsis">{!!title ? title : _id}</div>
          </div>
          {!voucherSetId ? (
            <div className="price flex split">
              <div className="value flex center">
                {currencyIcon} {price} {currency}
              </div>
            </div>
          ) : (
            <div className="expires">
              <p>
                Expires on{" "}
                {expiryDate ? formatDate(expiryDate, "string") : "..."}
              </p>
            </div>
          )}
        </div>
        <div className="statuses">
          {statuses
            ? Object.keys(statuses).map((status, i) =>
                statusOrder[status] ? (
                  <div key={i} className={`label color_${status}`}>
                    {status}
                  </div>
                ) : null
              )
            : null}
          {new Date() > new Date(expiryDate) ? (
            <div className="label color_EXPIRED">EXPIRED</div>
          ) : null}
          {FINALIZED ? (
            <div className="label color_FINALIZED">FINALIZED</div>
          ) : null}
        </div>
      </Link>
    </div>
  );
};