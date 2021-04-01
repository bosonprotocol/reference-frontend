import React, { useContext, useRef } from "react";

import { SellerContext, getData } from "../../../../contexts/Seller";

import CurrencySelector from "./currency-selector/CurrencySelector";

import { NAME } from "../../../../helpers/configs/Dictionary";
import {
  toFixed,
  totalDepositCalcEth,
  formatStringAsNumber,
} from "../../../../utils/FormatUtils";
import { ethers } from "ethers";

function NewOfferPrice({
  depositsPriceLimits,
  priceValueReceiver,
  priceCurrencyReceiver,
  sellerDepositCurrencyValueReceiver,
  sellerDepositValueReceiver,
  buyerDepositValueReceiver,
  quantityValueReceiver,
  quantityErrorMessage,
  sellerDepositErrorMessage,
  priceErrorMessage,
  buyerDepositErrorMessage,
}) {
  const sellerContext = useContext(SellerContext);

  const getOfferingData = getData(sellerContext.state.offeringData);

  const quantity = getOfferingData(NAME.QUANTITY);

  const priceCurrency = getOfferingData(NAME.PRICE_C) || "ETH";
  const depositsCurrency = getOfferingData(NAME.DEPOSITS_C) || "ETH";
  const buyer = getOfferingData(NAME.BUYER_DEPOSIT) || "ETH";
  const price = getOfferingData(NAME.PRICE);
  const sellerDeposit = getOfferingData(NAME.SELLER_DEPOSIT);
  const buyerDeposit = getOfferingData(NAME.BUYER_DEPOSIT);

  const priceInputRef = useRef(null);
  const buyersDepositInputRef = useRef(null);
  const sellersDepositInputRef = useRef(null);

  const calculateMaxForCurrency = (currency) => {
    if (currency) {
      const maxFromContract = depositsPriceLimits[currency].max;
      if (quantity && quantity > 0) {
        const maxWithQuantityTakenIntoAccount = maxFromContract.div(quantity);
        return toFixed(
          +ethers.utils.formatEther(maxWithQuantityTakenIntoAccount),
          // if the rounded value of 2 decimal points will result to 0.00, increase the decimal point to 5 (will always have value below 10'000 quantity)
          toFixed(
            +ethers.utils.formatEther(maxWithQuantityTakenIntoAccount),
            2
          ) === "0.00"
            ? 5
            : 2
        );
      }
      return ethers.utils.formatEther(maxFromContract);
    }
  };

  const isValid = (value) => {
    try {
      ethers.utils.parseEther(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  const updateValueIfValid = (event, valueReceiver) => {
    const maxLength = 20; // 18 + 2 = ETH token denomination + pre-decimal number and the decimal point

    if (event.target.value.length >= maxLength) {
      event.target.value = event.target.value.substr(0, maxLength); // restrict input length
    }

    event.target.value = formatStringAsNumber(event.target.value); // restrict to numeric value with optional decimal value

    if (
      !event ||
      isNaN(parseInt(event.target.value)) ||
      !isValid(event.target.value)
    ) {
      valueReceiver(null);
      return;
    }

    valueReceiver(ethers.utils.parseEther(event.target.value));
  };

  const validateQuantity = (e) => {
    const value = parseInt(e.target.value);

    if (Number.isInteger(value)) {
      if (value <= 100000) {
        // arbitrary but set to 6 due to the number of decimal digits in "max" hint (in input field)
        quantityValueReceiver(value);
        e.target.value = value;
      } else {
        e.target.value = "";
        quantityValueReceiver("");
      }
    } else {
      e.target.value = "";
      quantityValueReceiver("");
    }
  };

  /**
   * If the final character in an input field is
   * a full-stop then this function removes it.
   * To use, call it using "onBlur".
   * @param e
   */
  const removePointOnLoseFocus = (e) => {
    const lastChar = e.target.value
      .toString()
      .substr(e.target.value.length - 1);
    if (lastChar === ".") {
      e.target.value = e.target.value.substr(0, e.target.value.length - 1);
    }
  };
  return (
    <div className="price">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-quantity">Quantity</label>
          <div className="input focus" data-error={quantityErrorMessage}>
            <input id="offer-quantity" onInput={(e) => validateQuantity(e)} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-price">Payment Price Per Voucher</label>
          <div className="bind">
            <CurrencySelector inputValueHandler={priceCurrencyReceiver} />
            <div
              className="input relative focus"
              data-error={priceErrorMessage ? "" : null}
            >
              <input
                ref={priceInputRef}
                style={priceErrorMessage ? { color: "#FA5B66" } : {}}
                id="offer-price"
                onWheel={() => priceInputRef.current.blur()}
                onBlur={(e) => removePointOnLoseFocus(e)}
                onChange={(e) => updateValueIfValid(e, priceValueReceiver)}
              />
              {depositsPriceLimits[priceCurrency]?.max ? (
                <div className="max">
                  max{" "}
                  {depositsPriceLimits[priceCurrency]
                    ? calculateMaxForCurrency(priceCurrency)
                    : null}{" "}
                  {priceCurrency}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {quantity > 1 && price
        ? getLimitCalculationsBar(
            price,
            quantity,
            priceCurrency,
            priceErrorMessage
          )
        : null}
      <div className="row">
        <div className="field dual">
          <label htmlFor="offer-seller-deposit">
            Seller’s Deposit Per Voucher
          </label>
          <div className="bind">
            <CurrencySelector
              inputValueHandler={sellerDepositCurrencyValueReceiver}
            />
            <div
              className="input relative focus"
              data-error={sellerDepositErrorMessage ? "" : null}
            >
              <input
                ref={sellersDepositInputRef}
                style={sellerDepositErrorMessage ? { color: "#FA5B66" } : {}}
                id="offer-seller-deposit"
                onWheel={() => sellersDepositInputRef.current.blur()}
                onBlur={(e) => removePointOnLoseFocus(e)}
                onChange={(e) =>
                  updateValueIfValid(e, sellerDepositValueReceiver)
                }
              />
              {depositsPriceLimits[depositsCurrency]?.max ? (
                <div className="max">
                  max{" "}
                  {depositsPriceLimits[depositsCurrency]
                    ? calculateMaxForCurrency(depositsCurrency)
                    : null}{" "}
                  {depositsCurrency}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {quantity > 1 && sellerDeposit
        ? getLimitCalculationsBar(
            sellerDeposit,
            quantity,
            depositsCurrency,
            sellerDepositErrorMessage
          )
        : null}
      <div className="row">
        <div className="field">
          <label htmlFor="offer-buyer-deposit">
            Buyer’s Deposit Per Voucher
          </label>
          <div
            className="input relative focus"
            data-error={buyerDepositErrorMessage ? "" : null}
          >
            <div
              name={NAME.PRICE_SUFFIX}
              className="pseudo"
            >{`${buyer} ${depositsCurrency}`}</div>
            <input
              id="offer-buyer-deposit"
              ref={buyersDepositInputRef}
              style={buyerDepositErrorMessage ? { color: "#FA5B66" } : {}}
              onWheel={() => buyersDepositInputRef.current.blur()}
              name={NAME.BUYER_DEPOSIT}
              onBlur={(e) => removePointOnLoseFocus(e)}
              onChange={(e) => updateValueIfValid(e, buyerDepositValueReceiver)}
            />
            {depositsPriceLimits[depositsCurrency].max ? (
              <div className="max">
                max{" "}
                {depositsPriceLimits[depositsCurrency]
                  ? calculateMaxForCurrency(depositsCurrency)
                  : null}{" "}
                {depositsCurrency}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {quantity > 1 && buyerDeposit
        ? getLimitCalculationsBar(
            buyerDeposit,
            quantity,
            depositsCurrency,
            buyerDepositErrorMessage
          )
        : null}
    </div>
  );
}

export default NewOfferPrice;

const getLimitCalculationsBar = (amount, quantity, currency, errorMessage) => (
  <div
    className="row flex split"
    style={{ background: "#151A1F", height: "50px", marginTop: "20px" }}
  >
    <p className="flex" style={{ padding: "15px 13px" }}>
      <span
        className="field dual"
        style={errorMessage ? { color: "#FA5B66" } : {}}
      >
        {`${ethers.utils.formatEther(amount)} ${currency} `}
      </span>
      <span className="field dual">
        &nbsp; {` x ${quantity} voucher${quantity > 1 ? "s" : ""}`}
      </span>
    </p>
    <p className="field dual" style={{ padding: "15px 13px" }}>
      {`=    ${totalDepositCalcEth(amount, quantity)} ${currency}`}
    </p>
  </div>
);