import React, { useState, useEffect, useRef, useContext } from "react";

import "../../styles/ProductView.scss";

import { useHistory } from "react-router";

import "./NewOffer.scss";

import NewOfferCategory from "./components/new-offer-category/NewOfferCategory";
import FormUploadPhoto from "./components/new-offer-photo/NewOfferPhoto";
import NewOfferGeneral from "./components/new-offer-general/NewOfferGeneral";
import NewOfferPrice from "./components/new-offer-price/NewOfferPrice";
import NewOfferDates from "./components/new-offer-dates/NewOfferDates";
import NewOfferLocation from "./components/new-offer-location/NewOfferLocation";
import NewOfferSummary from "./components/new-offer-summary/NewOfferSummary";

import { SellerContext, Seller } from "../../contexts/Seller";
import { NavigationContext, Action } from "../../contexts/Navigation";

import {DEFAULT_COUNTRY_NAME, DEFAULT_CITY_NAME} from '../../utils/location/location'

import {
  NAME,
  CURRENCY,
  MODAL_TYPES,
  ROUTE,
} from "../../helpers/configs/Dictionary";
import { getAccountStoredInLocalStorage } from "../../hooks/authenticate";
import { ModalContext, ModalResolver } from "../../contexts/Modal";
import { useWeb3React } from "@web3-react/core";
import { checkForErrorsInNewOfferForm } from "../../helpers/validators/NewOfferFormValidator";
import { useFundLimitsContract } from "../../hooks/useContract";
import { SMART_CONTRACTS } from "../../hooks/configs";

// switch with 'change', if you want to trigger on completed input, instead on each change
const depositsPriceLimits = {
  [CURRENCY.ETH]: {
    max: 0,
  },
  [CURRENCY.BSN]: {
    max: 0,
  },
};

function NewOffer() {
  const screenController = useRef();
  const sellerContext = useContext(SellerContext);
  const navigationContext = useContext(NavigationContext);
  const [init, triggerInit] = useState(1);
  const activeScreen = sellerContext.state.offeringProgress;
  const inScreenRange = (target) => target >= 0 && target < screens.length;
  const history = useHistory();
  const modalContext = useContext(ModalContext);
  const [errorMessages, setErrorMessages] = useState({});
  const [lastInputChangeName, setLastInputChangeName] = useState(null);
  const inputFallback = {
    [NAME.PRICE_C]: CURRENCY.ETH,
    [NAME.DEPOSITS_C]: CURRENCY.ETH,
    [NAME.DATE_START]: new Date().setHours(0, 0, 0, 0),
    [NAME.COUNTRY]: DEFAULT_COUNTRY_NAME,
    [NAME.CITY]: DEFAULT_CITY_NAME,
  };
  const fundLimitsContract = useFundLimitsContract();

  useEffect(() => {
    if (fundLimitsContract) {
      async function setLimits() {
        const ethLimit = await fundLimitsContract.getETHLimit();
        const bosonLimit = await fundLimitsContract.getTokenLimit(
          SMART_CONTRACTS.BosonTokenContractAddress
        );
        depositsPriceLimits[CURRENCY.ETH] = { max: ethLimit };
        depositsPriceLimits[CURRENCY.BSN] = { max: bosonLimit };
      }
      setLimits();
    }
  }, [fundLimitsContract]);

  useEffect(() => {
    const getData = (name) => sellerContext.state.offeringData[name];

    if (lastInputChangeName) {
      const newErrorMessages = checkForErrorsInNewOfferForm(
        errorMessages,
        getData,
        lastInputChangeName,
        depositsPriceLimits
      );
      setErrorMessages(newErrorMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerContext.state.offeringData, lastInputChangeName]);

  useEffect(() => {
    sellerContext.dispatch(Seller.resetOfferingData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createInputValueReceiver = (inputName) => (value) => {
    if (value || value === "" || value === 0) {
      if (!(inputName === NAME.IMAGE)) {
        sellerContext.dispatch(
          Seller.updateOfferingData({
            [inputName]: value,
          })
        );
      } else {
        sellerContext.dispatch(
          Seller.updateOfferingData({
            [NAME.SELECTED_FILE]: value,
          })
        );
        const fileReader = new FileReader();

        fileReader.addEventListener("load", (e) => {
          sellerContext.dispatch(
            Seller.updateOfferingData({ [inputName]: e.currentTarget.result })
          );
        });

        fileReader.readAsDataURL(value);
      }
      setLastInputChangeName(inputName);
    }

    if (
      value === null &&
      (inputName === NAME.PRICE ||
        inputName === NAME.BUYER_DEPOSIT ||
        inputName === NAME.SELLER_DEPOSIT)
    ) {
      sellerContext.dispatch(Seller.updateOfferingData({ [inputName]: value }));
    }
  };
  const screens = [
    <NewOfferCategory
      inputValueReceiver={createInputValueReceiver(NAME.CATEGORY)}
    />,
    <FormUploadPhoto
      inputValueReceiver={createInputValueReceiver(NAME.IMAGE)}
      uploadImageErrorMessage={errorMessages[NAME.IMAGE]}
    />,
    <NewOfferGeneral
      titleValueReceiver={createInputValueReceiver(NAME.TITLE)}
      titleErrorMessage={errorMessages[NAME.TITLE]}
      conditionValueReceiver={createInputValueReceiver(NAME.CONDITION)}
      descriptionValueReceiver={createInputValueReceiver(NAME.DESCRIPTION)}
      descriptionErrorMessage={errorMessages[NAME.DESCRIPTION]}
    />,
    <NewOfferPrice
      depositsPriceLimits={depositsPriceLimits}
      priceValueReceiver={createInputValueReceiver(NAME.PRICE)}
      priceCurrencyReceiver={createInputValueReceiver(NAME.PRICE_C)}
      sellerDepositCurrencyValueReceiver={createInputValueReceiver(
        NAME.DEPOSITS_C
      )}
      sellerDepositValueReceiver={createInputValueReceiver(NAME.SELLER_DEPOSIT)}
      buyerPriceSuffixValueReceiver={createInputValueReceiver(
        NAME.PRICE_SUFFIX
      )}
      buyerDepositValueReceiver={createInputValueReceiver(NAME.BUYER_DEPOSIT)}
      quantityValueReceiver={createInputValueReceiver(NAME.QUANTITY)}
      quantityErrorMessage={errorMessages[NAME.QUANTITY]}
      priceErrorMessage={errorMessages[NAME.PRICE]}
      sellerDepositErrorMessage={errorMessages[NAME.SELLER_DEPOSIT]}
      buyerDepositErrorMessage={errorMessages[NAME.BUYER_DEPOSIT]}
    />,
    <NewOfferDates
      startDateValueReceiver={createInputValueReceiver(NAME.DATE_START)}
      startDateErrorMessage={errorMessages[NAME.DATE_START]}
      endDateValueReceiver={createInputValueReceiver(NAME.DATE_END)}
      endDateErrorMessage={errorMessages[NAME.DATE_END]}
    />,
    <NewOfferLocation
      countryValueReceiver={createInputValueReceiver(NAME.COUNTRY)}

      cityValueReceiver={createInputValueReceiver(NAME.CITY)}

      addressLineOneValueReceiver={createInputValueReceiver(NAME.ADDRESS_LINE_ONE)}
      addressLineOneErrorMessage={errorMessages[NAME.ADDRESS_LINE_ONE]}

      addressLineTwoValueReceiver={createInputValueReceiver(NAME.ADDRESS_LINE_TWO)}
      addressLineTwoErrorMessage={errorMessages[NAME.ADDRESS_LINE_TWO]}

      postcodeValueReceiver={createInputValueReceiver(NAME.POSTCODE)}
      postcodeErrorMessage={errorMessages[NAME.POSTCODE]}
    />,
    <NewOfferSummary />,
  ];

  const lastScreenBoolean = activeScreen === screens.length - 1;

  const setActiveScreen = (target, backToHome) => {
    return backToHome
      ? history.push(ROUTE.Home)
      : inScreenRange(target) &&
          sellerContext.dispatch(Seller.setOfferingProgress(target));
  };

  const { account } = useWeb3React();

  // check for backup
  useEffect(() => {
    sellerContext.dispatch(
      Seller.updateOfferingData({
        ...inputFallback,
      })
    );

    triggerInit(init * -1);

    const authData = getAccountStoredInLocalStorage(account);

    if (!authData.activeToken) {
      history.push(ROUTE.Home);

      modalContext.dispatch(
        ModalResolver.showModal({
          show: true,
          type: MODAL_TYPES.GENERIC_ERROR,
          content:
            "Please check your wallet for Signature Request. Once authentication message is signed you can proceed",
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigationContext.dispatch(
      Action.setFormNavigation({
        screenController: screenController,
        lastScreenBoolean: lastScreenBoolean,
        activeScreen: activeScreen,
        setActiveScreen: setActiveScreen,
        errorMessages: errorMessages,
        screens: screens,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenController, lastScreenBoolean, activeScreen, errorMessages]);

  return (
    <section className="new-offer">
      <div className="container l flex column jc-sb">
        <div className="bind column">
          <div className="screen">
            <form id="offer-form">
              <div ref={screenController} className="screen-controller">
                {screens.map((screen, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: activeScreen === index ? "block" : "none",
                      }}
                    >
                      {screen}
                    </div>
                  );
                })}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewOffer;
