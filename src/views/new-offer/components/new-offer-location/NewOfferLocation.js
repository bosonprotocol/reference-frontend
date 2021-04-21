import React, { useRef, useEffect, useContext, useState } from "react";

import { NAME } from "../../../../helpers/configs/Dictionary";
import { SellerContext, getData } from "../../../../contexts/Seller";

function NewOfferLocation({
  countryValueReceiver,
  countryErrorMessage,
  cityValueReceiver,
  cityErrorMessage,
  addressLineOneValueReceiver,
  addressLineOneErrorMessage,

  addressLineTwoValueReceiver,
  addressLineTwoErrorMessage,

  postcodeValueReceiver,
  postcodeErrorMessage
}) {
  const conditionTarget = useRef();
  const titleInput = useRef();
  const titleClear = useRef();

  const countryInput = useRef()
  const countryClear = useRef()

  const cityInput = useRef()
  const cityClear = useRef()

  const addressLineOneInput = useRef()
  const addressLineOneClear = useRef()

  const addressLineTwoInput = useRef()
  const addressLineTwoClear = useRef()

  const postcodeInput = useRef()
  const postcodeClear = useRef()

  const [titleHasBeenBlurred, setTitleHasBeenBlurred] = useState(false);
  const [countryHasBeenBlurred, setCountryHasBeenBlurred] = useState(false)
  const [cityHasBeenBlurred, setCityHasBeenBlurred] = useState(false)
  const [addressOneHasBeenBlurred, setAddressOneHasBeenBlurred] = useState(false)
  const [addressTwoHasBeenBlurred, setAddressTwoHasBeenBlurred] = useState(false)
  const [postcodeHasBeenBlurred, setPostcodeHasBeenBlurred] = useState(
    false
  );

  const sellerContext = useContext(SellerContext);
  const getOfferingData = getData(sellerContext.state.offeringData);
  const selectedCategory = getOfferingData(NAME.CONDITION);

  const description = getOfferingData(NAME.DESCRIPTION);
  const maxSymbols = 160;

  const selectLabel = (el) => {
    Array.from(
      el.parentElement.parentElement.querySelectorAll("label")
    ).forEach((label) => {
      label.classList.remove("active");
    });
    el.parentElement.querySelector("label").classList.add("active");
    conditionValueReceiver(el.value);
  };

  const handleClearField = (e, callback) => {
    e.target.parentElement.getElementsByTagName("input")[0].value = "";
    callback("");
  };

  return (
    <div className="general">
      <div>
        <h1>Pick-up location</h1>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="offer-country">Country</label>
          <div
            className="input focus"
            data-error={countryHasBeenBlurred ? countryErrorMessage : null}
          >
            <input
              ref={countryInput}
              id="offer-country"
              type="text"
              onBlur={() => setCountryHasBeenBlurred(true)}
              onChange={(e) =>
                countryValueReceiver(e.target ? e.target.value : null)
              }
            />
            <div
              ref={countryClear}
              className={`clear-field ${
                countryInput.current &&
                (countryInput.current.value !== "" ? "active" : "hidden")
              }`}
              onClick={(e) => handleClearField(e, countryValueReceiver)}
            ></div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="offer-city">City</label>
          <div
            className="input focus"
            data-error={cityHasBeenBlurred ? cityErrorMessage : null}
          >
            <input
              ref={cityInput}
              id="offer-city"
              type="text"
              onBlur={() => setCityHasBeenBlurred(true)}
              onChange={(e) =>
                cityValueReceiver(e.target ? e.target.value : null)
              }
            />
            <div
              ref={cityClear}
              className={`clear-field ${
                cityInput.current &&
                (cityInput.current.value !== "" ? "active" : "hidden")
              }`}
              onClick={(e) => handleClearField(e, cityValueReceiver)}
            ></div>
          </div>
        </div>
      </div>


      <div className="row">
        <div className="field">
          <label htmlFor="offer-address-line-one">Address line 1</label>
          <div
            className="input focus"
            data-error={addressOneHasBeenBlurred ? addressLineOneErrorMessage : null}
          >
            <input
              ref={addressLineOneInput}
              id="offer-address-line-one"
              type="text"
              onBlur={() => setAddressOneHasBeenBlurred(true)}
              onChange={(e) =>
                addressLineOneValueReceiver(e.target ? e.target.value : null)
              }
            />
            <div
              ref={addressLineOneClear}
              className={`clear-field ${
                addressLineOneInput.current &&
                (addressLineOneInput.current.value !== "" ? "active" : "hidden")
              }`}
              onClick={(e) => handleClearField(e, addressLineOneValueReceiver)}
            ></div>
          </div>
        </div>
      </div>


      <div className="row">
        <div className="field">
          <label htmlFor="offer-address-line-two">Address line 2</label>
          <div
            className="input focus"
            data-error={addressTwoHasBeenBlurred ? addressLineTwoErrorMessage : null}
          >
            <input
              ref={addressLineTwoInput}
              id="offer-address-line-two"
              type="text"
              onBlur={() => setAddressTwoHasBeenBlurred(true)}
              onChange={(e) =>
                addressLineTwoValueReceiver(e.target ? e.target.value : null)
              }
            />
            <div
              ref={addressLineTwoClear}
              className={`clear-field ${
                addressLineTwoInput.current &&
                (addressLineTwoInput.current.value !== "" ? "active" : "hidden")
              }`}
              onClick={(e) => handleClearField(e, addressLineTwoValueReceiver)}
            ></div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="offer-postcode">Postcode</label>
          <div
            className="input focus"
            data-error={postcodeHasBeenBlurred ? postcodeErrorMessage : null}
          >
            <input
              ref={postcodeInput}
              id="offer-postcode"
              type="text"
              onBlur={() => setPostcodeHasBeenBlurred(true)}
              onChange={(e) =>
                postcodeValueReceiver(e.target ? e.target.value : null)
              }
            />
            <div
              ref={postcodeClear}
              className={`clear-field ${
                postcodeInput.current &&
                (postcodeInput.current.value !== "" ? "active" : "hidden")
              }`}
              onClick={(e) => handleClearField(e, postcodeValueReceiver)}
            ></div>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default NewOfferLocation;
