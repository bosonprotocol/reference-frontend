/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useContext } from "react";

import "./Home.scss";

import ProductBlock from "./components/product-block/ProductBlock";
import CategoryMenu from "./components/category-menu/CategoryMenu";
import Onboarding from "../onboarding/Onboarding";
import QRCodeScanner from "../../shared-components/qr-code-scanner/QRCodeScanner";

import { GlobalContext, Action } from "../../contexts/Global";

import { useWeb3React } from "@web3-react/core";
import {
  authenticateUser,
  getAccountStoredInLocalStorage,
} from "../../hooks/authenticate";
import { IconHome, IconLocation } from "../../shared-components/icons/Icons";
import { ROUTE } from "../../helpers/configs/Dictionary";
import { Link } from "react-router-dom";
import { DEFAULT_FILTER } from "../../constants/Categories";

function Home() {
  const [productBlocks, setProductBlocks] = useState([]);
  const homepage = useRef();

  const onboardingCompletedStep = localStorage.getItem("onboarding-slide");
  const lastOnboardingSlideIndex = 3;

  const [newUser, setNewUser] = useState(
    +onboardingCompletedStep < lastOnboardingSlideIndex
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

  const resetVoucherSetsCityFilter = () => {
    //if city filter is reset, we fetch voucher-sets from DB
    globalContext.dispatch(Action.updateVoucherSetsByLocation(""));
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
        <div className="onboarding-modal center" ref={onboardingModalRef}>
          <Onboarding completeOnboarding={completeOnboarding} />
        </div>
      )}
      <div className={`screens ${newUser ? "new-user" : ""}`} ref={screensRef}>
        <div ref={homepage} className="home relative atomic-scoped">
          <div className="container o-hidden flex row jc-sb padding-top-16">
            <Link className="def" to={ROUTE.Search}>
              <div className={`search-icon flex`}>
                <IconHome />
                <div className="search-label">Search</div>
              </div>
            </Link>
            {globalContext.state.selectedCity ? (
              <div
                className="flex jc-sb location-container"
                onClick={resetVoucherSetsCityFilter}
              >
                <IconLocation />
                <div className="inline-container">
                  {globalContext.state.selectedCity}
                  <div className="clear-filter">X</div>
                </div>
              </div>
            ) : (
              <Link
                className="def location-container no-background flex"
                to={ROUTE.PickUpLocation}
              >
                <div>Show vouchers in my area</div>
                <p className="arrow right"></p>
              </Link>
            )}
          </div>
          <div className="container o-hidden">
            <CategoryMenu handleCategory={filterByCategory} />
          </div>
          <section className="product-list">
            <div className="container">
              {!pageLoading ? (
                productBlocks?.length ? (
                  productBlocks.map((block, id) => (
                    <ProductBlock key={id} {...block} />
                  ))
                ) : (
                  <div>No vouchers available at the selected location.</div>
                )
              ) : (
                loadingPlaceholder
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
