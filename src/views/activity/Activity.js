/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import "./Activity.scss";

import { GlobalContext, Action } from "../../contexts/Global";

import { QUERY_PARAMS, ROUTE } from "../../helpers/configs/Dictionary";

import {
  Quantity,
  IconActivityMessage,
  IconEth,
  IconBsn,
} from "../../shared-components/icons/Icons";

import {
  getAccountVouchers,
  getParsedAccountVoucherSets,
  getParsedVouchersFromSupply,
} from "../../helpers/parsers/VoucherAndSetParsers";

import { ModalContext } from "../../contexts/Modal";
import { useWeb3React } from "@web3-react/core";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import {
  VOUCHER_TYPE,
  sortBlocks,
  ActiveTab,
} from "../../helpers/ActivityHelper";

import { WalletConnect } from "../../shared-components/wallet-connect/WalletConnect";
import { formatDate } from "../../utils/FormatUtils";

export function ActivityAccountVouchers({ title, voucherSetId, block }) {
  const [accountVouchers, setAccountVouchers] = useState([]);
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
    <ActivityView
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

export function ActivityVoucherSetView() {
  const history = useHistory();
  const globalContext = useContext(GlobalContext);
  const locationPath = history.location.pathname.split("/");

  const [voucherSetId, setVoucherSetId] = useState();
  const [block, setBlock] = useState();

  useEffect(() => {
    globalContext.dispatch(Action.fetchVoucherSets());
  }, []);

  useEffect(() => {
    const getVoucherSet = globalContext.state.allVoucherSets.find(
      (voucher) => voucher.id === voucherSetId
    );

    setVoucherSetId(locationPath[locationPath.length - 2]);
    setBlock(getVoucherSet);
  }, [globalContext.state.allVoucherSets, voucherSetId]);

  return (
    <section className="activity atomic-scoped">
      <div className="vouchers-container container">
        <VoucherSetBlock {...block} key={voucherSetId} openDetails />
        <ActivityAccountVouchers
          block={block}
          voucherSetId={voucherSetId}
          title="Vouchers"
        />
      </div>
    </section>
  );
}

export function ActivityVoucherSets() {
  const [voucherBlocks, setVoucherBlocks] = useState([]);
  const { account } = useWeb3React();

  useEffect(() => {
    getParsedAccountVoucherSets(account).then((voucherSets) => {
      if (voucherSets) setVoucherBlocks(voucherSets);
    });
  }, [account]);

  return (
    <ActivityView
      voucherBlocks={voucherBlocks}
      account={account}
      voucherType={VOUCHER_TYPE.voucherSet}
    />
  );
}

function ActivityView(props) {
  const {
    voucherBlocks,
    voucherType,
    account,
    title,
    voucherSetId,
    block,
  } = props;
  const globalContext = useContext(GlobalContext);

  const [resultVouchers, setResultVouchers] = useState([]);
  const [activeVouchers, setActiveVouchers] = useState([]);
  const [inactiveVouchers, setInactiveVouchers] = useState([]);
  const [pageLoading, setPageLoading] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem("isAuthenticated"))
  );

  const activityBlockPlaceholder = (
    <div className="placeholder-parent">
      <div className="block plceholder is-loading"></div>
    </div>
  );

  const getLastAction = (el) => {
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
      if (voucherType === VOUCHER_TYPE.voucherSet && resultVouchers) {
        for (let i in resultVouchers) {
          const supply = await getParsedVouchersFromSupply(
            resultVouchers[i]._id,
            account
          );

          let hasActive = false;
          for (let j = 0; j < supply?.vouchers?.length; j++) {
            if (!!supply?.vouchers[j].FINALIZED === false) {
              hasActive = true;
            }
          }
          resultVouchers[i].hasActiveVouchers = hasActive; // check if there are active vouchers
        }
      }

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

      if (account && isAuthenticated) {
        setPageLoading(0);
      }
    };

    sortVouchersToActiveAndInactive();
  }, [resultVouchers]);

  const activityMessageType = {
    [VOUCHER_TYPE.accountVoucher]: {
      active: "active vouchers.",
      inactive: "inactive vouchers.",
    },
    [VOUCHER_TYPE.voucherSet]: {
      active: "open voucher sets.",
      inactive: "closed voucher sets.",
    },
  };

  const activityMessage = (message) => {
    return account ? (
      <div className="no-vouchers flex column center">
        <p>You currently have no {message}</p>
        <IconActivityMessage />
      </div>
    ) : (
      <div className="no-vouchers flex column center">
        <p>
          <strong>No wallet connected.</strong> <br /> Connect to a wallet to
          view your vouchers.
        </p>
        <WalletConnect />
      </div>
    );
  };

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
        <div className="container">
          <div className="page-title">
            <h1>
              {title
                ? title
                : voucherType === VOUCHER_TYPE.accountVoucher
                ? "Purchased"
                : "Offered"}
            </h1>
          </div>
          {
            <Tabs>
              <TabList>
                <Tab>
                  {voucherType === VOUCHER_TYPE.accountVoucher
                    ? "Active"
                    : "Open"}
                </Tab>
                <Tab>
                  {voucherType === VOUCHER_TYPE.accountVoucher
                    ? "Inactive"
                    : "Closed"}
                </Tab>
              </TabList>
              <>
                <TabPanel>
                  {!pageLoading ? (
                    activeVouchers?.length > 0 && !!account ? (
                      <ActiveTab
                        voucherSetId={voucherSetId && voucherSetId}
                        voucherType={voucherType}
                        products={activeVouchers}
                      />
                    ) : (
                      activityMessage(activityMessageType[voucherType].active)
                    )
                  ) : (
                    activityBlockPlaceholder
                  )}
                </TabPanel>
                <TabPanel>
                  {!pageLoading ? (
                    inactiveVouchers?.length > 0 && !!account ? (
                      <ActiveTab
                        voucherSetId={voucherSetId && voucherSetId}
                        voucherType={voucherType}
                        products={inactiveVouchers}
                      />
                    ) : (
                      activityMessage(activityMessageType[voucherType].inactive)
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

export const VoucherSetBlock = (props) => {
  const [expand] = useState(1);
  const {
    title,
    image,
    price,
    qty,
    _id,
    openDetails,
    paymentType,
    searchCriteria,
  } = props;
  const currency = paymentType === 1 || paymentType === 2 ? "ETH" : "BSN";
  const currencyIcon =
    paymentType === 1 || paymentType === 2 ? <IconEth /> : <IconBsn />;

  return (
    <Link
      to={
        !openDetails
          ? `${ROUTE.Activity}/${_id}${ROUTE.VoucherSetView}`
          : searchCriteria
          ? `${ROUTE.Activity}/${_id}${ROUTE.Details}?searchCriteria=${searchCriteria}`
          : `${ROUTE.Activity}/${_id}${ROUTE.Details}`
      }
    >
      <div
        className={`collapsible state_${expand > 0 ? "opened" : "collapsed"}`}
      >
        <div className="voucher-block solo flex relative">
          <div className="thumb no-shrink">
            <img src={image} alt={title} />
          </div>
          <div className="info grow flex column jc-sb">
            <div className="title-container">
              <div className="status">
                <p>VOUCHER SET</p>
              </div>
              <div className="title elipsis">{title}</div>
            </div>
            <div className="price flex split">
              <div className="value flex center">
                {currencyIcon}
                {price} {currency}
              </div>
              <div className="quantity">
                <span className="icon">
                  <Quantity />
                </span>{" "}
                QTY: {qty}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
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
          className={`info grow flex ${!voucherSetId ? "jc-sb" : ""} column`}
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
