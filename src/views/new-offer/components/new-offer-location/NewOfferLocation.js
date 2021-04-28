import React, { useRef, useEffect, useContext, useState } from "react";

import { NAME } from "../../../../helpers/configs/Dictionary";
import { SellerContext, getData } from "../../../../contexts/Seller";
import {
  getSortedCountryNames,
  getSortedCityNamesByCountryCode,
  getDefaultCityForCountry,
  getISOCodeByName,
} from "../../../../utils/location/location";

import { DropDownContainer } from "../../../../shared-components/dropdown-container/DropDown";

function NewOfferLocation({
  countryValueReceiver,
  cityValueReceiver,
  addressLineOneValueReceiver,
  addressLineOneErrorMessage,

  addressLineTwoValueReceiver,
  addressLineTwoErrorMessage,

  postcodeValueReceiver,
  postcodeErrorMessage,
}) {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  const countryInput = useRef();
  const cityInput = useRef();

  const addressLineOneInput = useRef();
  const addressLineOneClear = useRef();

  const addressLineTwoInput = useRef();
  const addressLineTwoClear = useRef();

  const postcodeInput = useRef();
  const postcodeClear = useRef();

  const [addressOneHasBeenBlurred, setAddressOneHasBeenBlurred] = useState(
    false
  );
  const [addressTwoHasBeenBlurred, setAddressTwoHasBeenBlurred] = useState(
    false
  );
  const [postcodeHasBeenBlurred, setPostcodeHasBeenBlurred] = useState(false);

  const sellerContext = useContext(SellerContext);
  const getOfferingData = getData(sellerContext.state.offeringData);

  const selectedCountry = getOfferingData(NAME.COUNTRY);
  const selectedCity = getOfferingData(NAME.CITY);

  const handleClearField = (e, callback) => {
    e.target.parentElement.getElementsByTagName("input")[0].value = "";
    callback("");
  };

  useEffect(() => {
    const countryISOCOde = getISOCodeByName(selectedCountry);
    setDropDownCountries();
    setDropDownCities(countryISOCOde);

    const defaultCityName = getDefaultCityForCountry(countryISOCOde);
    cityValueReceiver(defaultCityName);
  }, [selectedCountry]);

  const setDropDownCountries = () => {
    const countries = getSortedCountryNames();
    setCountries(countries);
  };

  const setDropDownCities = (iSOCode) => {
    const cities = getSortedCityNamesByCountryCode(iSOCode);
    setCities(cities);
  };

  return (
    <div className="general">
      <div className="step-title">
        <h1>Pick-up location</h1>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="countries">Country</label>
          <DropDownContainer
            arr={countries}
            id="offer-country"
            refInput={countryInput}
            selected={selectedCountry}
            receiver={countryValueReceiver}
          />
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-city">City</label>
          <DropDownContainer
            arr={cities}
            id="offer-city"
            refInput={cityInput}
            selected={selectedCity}
            receiver={cityValueReceiver}
          />
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-address-line-one">Address line 1</label>
          <div
            className="input focus"
            data-error={
              addressOneHasBeenBlurred ? addressLineOneErrorMessage : null
            }
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
            data-error={
              addressTwoHasBeenBlurred ? addressLineTwoErrorMessage : null
            }
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
