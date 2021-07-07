import React, { useContext, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { getParsedVouchersFromSupply } from "../../../helpers/parsers/VoucherAndSetParsers";
import {
  activityBlockPlaceholder,
  activityMessage,
  activityMessageType,
  getLastAction,
  sortBlocks,
  VOUCHER_TYPE,
} from "../../../helpers/ActivityHelper";
import { GlobalContext } from "../../../contexts/Global";
import {
  IconBsn,
  IconEth,
  Quantity,
} from "../../../shared-components/icons/Icons";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Link } from "react-router-dom";
import { ROUTE } from "../../../helpers/configs/Dictionary";

import "./../Activity.scss";

export function OfferedVoucherSets() {
  const [voucherBlocks, setVoucherBlocks] = useState(undefined);
  const { account } = useWeb3React();
  const globalContext = useContext(GlobalContext);

  const voucherSets = globalContext.state.allVoucherSets;

  useEffect(() => {
    if (voucherSets && account) {
      setVoucherBlocks(
        voucherSets.filter((x) => x.voucherOwner === account.toLowerCase())
      );
    }
  }, [account, voucherSets]);

  return (
    <OfferedView
      voucherBlocks={voucherBlocks}
      account={account}
      voucherType={VOUCHER_TYPE.voucherSet}
    />
  );
}

function OfferedView(props) {
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
            <h1>{title ? title : "Offered"}</h1>
          </div>
          {
            <Tabs>
              <TabList>
                <Tab>{"Open"}</Tab>
                <Tab>{"Closed"}</Tab>
              </TabList>
              <>
                <TabPanel>
                  {!pageLoading ? (
                    activeVouchers?.length > 0 && !!account ? (
                      <OfferedTab products={activeVouchers} />
                    ) : (
                      activityMessage(
                        activityMessageType[VOUCHER_TYPE.voucherSet].active,
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
                      <OfferedTab products={inactiveVouchers} />
                    ) : (
                      activityMessage(
                        activityMessageType[VOUCHER_TYPE.voucherSet].inactive,
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

export const OfferedTab = (props) => {
  const { products } = props;

  return (
    <div className="voucher-set-container">
      {products.map((voucherSet, id) => (
        <VoucherSetBlock {...voucherSet} key={id} />
      ))}
    </div>
  );
};

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
            <div className="price flex split activity-price">
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
