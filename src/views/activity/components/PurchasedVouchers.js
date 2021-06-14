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
import QRCode from "qrcode.react";
import "./../Activity.scss";
import { formatDate } from "../../../utils/FormatUtils";
import { useVoucherStatusBlocks } from "../../../hooks/useVoucherStatusBlocks";

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
            voucher["price"] = block?.price;
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
        <SingleVoucherBlock
          voucherSetId={voucherSetId}
          voucher={voucher}
          key={id}
        />
      ))}
    </div>
  );
};

export const SingleVoucherBlock = ({ voucher, voucherSetId }) => {
  const { title, image, price, id, _id, expiryDate, FINALIZED, paymentType } =
    voucher;

  const statusBlocks = useVoucherStatusBlocks(voucher, null, false);

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
        ) : (
          <div className="qr-thumb">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="13.2852"
                y="13.2854"
                width="6.93603"
                height="6.93603"
                rx="2.19032"
                fill="#8393A6"
              ></rect>
              <rect
                x="13.2852"
                y="22.0464"
                width="6.93603"
                height="6.93603"
                rx="2.19032"
                fill="#8393A6"
              ></rect>
              <rect
                x="22.0476"
                y="22.0464"
                width="6.93603"
                height="6.93603"
                rx="2.19032"
                fill="#8393A6"
              ></rect>
              <rect
                x="22.0476"
                y="13.2737"
                width="6.93603"
                height="6.93603"
                rx="2.19032"
                fill="#8393A6"
              ></rect>
              <path
                d="M16.9363 10.0002H15.111C12.2884 10.0002 10.0002 12.2884 10.0002 15.111V16.9363"
                stroke="#8393A6"
                stroke-width="1.3099"
              ></path>
              <path
                d="M25.3323 32.2683L27.1576 32.2683C29.9801 32.2683 32.2683 29.9801 32.2683 27.1576L32.2683 25.3323"
                stroke="#8393A6"
                stroke-width="1.3099"
              ></path>
              <path
                d="M10 25.3323L10 27.1576C10 29.9801 12.2882 32.2683 15.1108 32.2683L16.936 32.2683"
                stroke="#8393A6"
                stroke-width="1.3099"
              ></path>
              <path
                d="M32.2683 16.936L32.2683 15.1108C32.2683 12.2882 29.9801 10 27.1576 10L25.3323 10"
                stroke="#8393A6"
                stroke-width="1.3099"
              ></path>
            </svg>
          </div>
        )}
        <div
          className={`info grow flex ${
            !voucherSetId ? "jc-sb voucher-set-info" : ""
          } column`}
        >
          {statusBlocks ? (
            <div className="status">
              <div className="status-container flex">
                {statusBlocks.map((x) => x.jsx)}
              </div>
            </div>
          ) : null}

          <div className="title elipsis">{!!title ? title : _id}</div>

          <div className="price flex split">
            <div className="value flex center">
              {currencyIcon} {price} {currency}
            </div>
          </div>
        </div>
        {!FINALIZED ? (
          <div className="expires">
            <p className="flex item">EXPIRES &nbsp;</p>

            <p className="flex item">
              {expiryDate ? formatDate(expiryDate, "string") : "..."}
            </p>
          </div>
        ) : null}
      </Link>
    </div>
  );
};
