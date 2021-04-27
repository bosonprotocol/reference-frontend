/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useContext } from "react";

import "./Home.scss";

import ProductBlock from "./components/product-block/ProductBlock";
import CardBlock from "./components/card-block/CardBlock";
import CategoryMenu from "./components/category-menu/CategoryMenu";
// import ProductListing from "../components/home/ProductListing"
import Onboarding from "../onboarding/Onboarding";
import QRCodeScanner from "../../shared-components/qr-code-scanner/QRCodeScanner";

import { GlobalContext, Action } from "../../contexts/Global";

import { useWeb3React } from "@web3-react/core";
import {
  authenticateUser,
  getAccountStoredInLocalStorage,
} from "../../hooks/authenticate";
import { IconHome } from "../../shared-components/icons/Icons";
import { ROUTE } from "../../helpers/configs/Dictionary";
import { Link } from "react-router-dom";
import { DEFAULT_FILTER } from "../../PlaceholderAPI";

function Home() {
  const [productBlocks, setProductBlocks] = useState([]);
  const homepage = useRef();
  const [newUser, setNewUser] = useState(
    !localStorage.getItem("onboarding-completed")
  );
  const screensRef = useRef();
  const onboardingModalRef = useRef();

  const [pageLoading, setPageLoading] = useState(1);

  const { account, library, chainId } = useWeb3React();

  const globalContext = useContext(GlobalContext);

  const loadingPlaceholder = (
    <div className="slider">
      <div className="block is-loading">
        <div className="text is-loading"></div>
        <div className="text is-loading"></div>
      </div>
      <div className="block is-loading">
        <div className="text is-loading"></div>
        <div className="text is-loading"></div>
      </div>
      <div className="block is-loading">
        <div className="text is-loading"></div>
        <div className="text is-loading"></div>
      </div>
    </div>
  );

  const voucherSets = globalContext.state.allVoucherSets;
  const modalCloseTimeout = 900;

  useEffect(() => {
    initialFilteringAndSorting();
  }, [voucherSets, globalContext.state.checkAccountUpdate]);

  const completeOnboarding = () => {
    localStorage.setItem("onboarding-completed", "1");
    globalContext.dispatch(Action.completeOnboarding());

    onboardingModalRef.current.classList.add("fade-out");
    screensRef.current.classList.add("onboarding-done");

    setTimeout(() => {
      setNewUser(false);
    }, modalCloseTimeout);

    if (!account) {
      return;
    }

    const localStoredAccountData = getAccountStoredInLocalStorage(account);
    const onboardingCompleted = localStorage.getItem("onboarding-completed");

    if (!onboardingCompleted || localStoredAccountData.activeToken) {
      return;
    }

    authenticateUser(library, account, chainId);
  };

  const initialFilteringAndSorting = () => {
    if (voucherSets) {
      // filter by "expiry date in future" and "don't show voucher sets to their creator/supplier"
      let filteredSets = voucherSets.filter(
        (x) =>
          new Date(x?.expiryDate) > new Date() &&
          x.voucherOwner !== account?.toLowerCase() &&
          x.qty > 0
      );

      filteredSets = orderByDate(filteredSets);

      setProductBlocks(filteredSets);
      setPageLoading(0);
    } else {
      setProductBlocks([]);
    }
  };

  const orderByDate = (voucherSets) => {
    return voucherSets.sort((a, b) => {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.offeredDate) - new Date(a.offeredDate);
    });
  };

  const filterByCategory = (category) => {
    if (category === DEFAULT_FILTER) {
      initialFilteringAndSorting();
      return;
    }

    if (voucherSets) {
      // filter by "expiry date in future" and "don't show voucher sets to their creator/supplier"
      let filteredSets = voucherSets.filter(
        (x) =>
          new Date(x?.expiryDate) > new Date() &&
          x.voucherOwner !== account?.toLowerCase() &&
          x.qty > 0 &&
          x.category === category
      );

      filteredSets = orderByDate(filteredSets);

      setProductBlocks(filteredSets);
      setPageLoading(0);
    } else {
      setProductBlocks([]);
    }
  };

  return (
    <>
      {globalContext.state.qrReaderActivated ? <QRCodeScanner /> : null}
      {newUser && (
        <div className="onboarding-modal flex center" ref={onboardingModalRef}>
          <Onboarding completeOnboarding={completeOnboarding} />
        </div>
      )}
      <div className={`screens ${newUser ? "new-user" : ""}`} ref={screensRef}>
        <div ref={homepage} className="home relative atomic-scoped">
          <div className="container o-hidden flex row jc-sb">
            <Link className="def" to={ROUTE.Search}>
              <div className={`search-icon flex`}>
                <IconHome />
                <div className="search-label">Search</div>
              </div>
            </Link>
            <div className="location-filter">
            <Link className="def" to={ROUTE.PickUpLocation}>
              <div className={`search-icon flex`}>
                {globalContext.state.selectedCity ? 
                <div>{globalContext.state.selectedCity}</div> 
                :<div className="flex">
                    <IconHome /> 
                    <div className="search-label">Show vouchers in my area {">"}</div>
                </div>
                }
              </div>
            </Link>
            </div>
          </div>
          <div className="container o-hidden">
            <CategoryMenu handleCategory={filterByCategory} />
          </div>
          <section className="product-list">
            <div className="container">
              {!pageLoading
                ? productBlocks?.length
                  ? productBlocks.map((block, id) => (
                      <ProductBlock key={id} {...block} />
                    ))
                  : null
                : loadingPlaceholder}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
