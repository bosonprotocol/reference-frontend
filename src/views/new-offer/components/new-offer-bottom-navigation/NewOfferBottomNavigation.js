import React, { useEffect, useState, useContext, useRef } from "react";

import { SellerContext, getData } from "../../../../contexts/Seller";
import { NAME } from "../../../../helpers/configs/Dictionary";

import NewOfferSubmit from "../new-offer-submit/NewOfferSubmit";

function NewOfferBottomNavigation(props) {
  const { lastScreenBoolean, activeScreen, setActiveScreen, errorMessages } =
    props;
  const [disabled, setDisabled] = useState(true);
  const buttonRef = useRef();

  const sellerContext = useContext(SellerContext);
  const getOfferingData = getData(sellerContext.state.offeringData);

  const screenFields = {
    0: [[NAME.CATEGORY]],
    1: [[NAME.IMAGE]],
    2: [[NAME.TITLE], [NAME.DESCRIPTION], [NAME.CONDITION]],
    3: [
      [NAME.PRICE],
      [NAME.QUANTITY],
      [NAME.SELLER_DEPOSIT],
      [NAME.BUYER_DEPOSIT],
    ],
    4: [[NAME.DATE_START], [NAME.DATE_END]],
    5: [
      [NAME.COUNTRY],
      [NAME.CITY],
      [NAME.ADDRESS_LINE_ONE],
      [NAME.ADDRESS_LINE_TWO],
      [NAME.POSTCODE],
    ],
  };
  // check if all fields are filled with no errors
  useEffect(() => {
    if (
      activeScreen !== undefined &&
      activeScreen !== null &&
      screenFields[activeScreen]
    ) {
      let disable = false;
      const activeScreenFieldNames = screenFields[activeScreen].map(
        (x) => x[0]
      );
      if (screenFields[activeScreen]) {
        activeScreenFieldNames.forEach((field) => {
          if (!getOfferingData(field) && field !== NAME.ADDRESS_LINE_TWO) {
            disable = true;
          }
        });
      }
      Object.keys(errorMessages).forEach((key) => {
        if (errorMessages[key] && activeScreenFieldNames.includes(key)) {
          disable = true;
        }
      });
      setDisabled(disable);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScreen, errorMessages]);

  const detectInvalidClicks = () => {
    if (buttonRef?.current?.disabled) {
      buttonRef.current?.classList?.add("message");

      setTimeout(() => {
        buttonRef.current?.classList?.remove("message");
      }, 2000);
    }
  };

  return (
    <div
      onClick={() => detectInvalidClicks()}
      className={`bottom-navigation relative${
        lastScreenBoolean ? " offer" : ""
      }`}
    >
      {lastScreenBoolean ? (
        <NewOfferSubmit />
      ) : (
        <button
          className="button primary"
          ref={buttonRef}
          onClick={() => setActiveScreen(activeScreen + 1)}
          disabled={disabled}
        >
          NEXT
        </button>
      )}
    </div>
  );
}

export default NewOfferBottomNavigation;
