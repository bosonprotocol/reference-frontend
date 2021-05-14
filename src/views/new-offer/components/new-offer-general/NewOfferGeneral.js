import React, { useRef, useEffect, useContext, useState } from "react";

import { NAME } from "../../../../helpers/configs/Dictionary";
import { SellerContext, getData } from "../../../../contexts/Seller";

function NewOfferGeneral({
  titleValueReceiver,
  conditionValueReceiver,
  titleErrorMessage,
  descriptionValueReceiver,
  descriptionErrorMessage,
}) {
  const conditionTarget = useRef();
  const titleInput = useRef();
  const titleClear = useRef();

  const [titleHasBeenBlurred, setTitleHasBeenBlurred] = useState(false);
  const [descriptionHasBeenBlurred, setDescriptionHasBeenBlurred] =
    useState(false);

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

  const handleClearField = (e) => {
    e.target.parentElement.getElementsByTagName("input")[0].value = "";
    titleValueReceiver("");
  };

  useEffect(() => {
    // state
    let element = conditionTarget.current?.querySelector(
      `[data-condition="${selectedCategory}"]`
    );

    if (element) {
      element.style.transition = "none";
      selectLabel(element);
      element.removeAttribute("transition");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="general">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-title">Title</label>
          <div
            className="input focus"
            data-error={titleHasBeenBlurred ? titleErrorMessage : null}
          >
            <input
              ref={titleInput}
              id="offer-title"
              type="text"
              onBlur={() => setTitleHasBeenBlurred(true)}
              onChange={(e) =>
                titleValueReceiver(e.target ? e.target.value : null)
              }
            />
            <div
              ref={titleClear}
              className={`clear-field ${
                titleInput.current &&
                (titleInput.current.value !== "" ? "active" : "hidden")
              }`}
              onClick={(e) => handleClearField(e)}
            ></div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="area field relative">
          <label htmlFor={NAME.DESCRIPTION}>Description</label>
          <div
            className="input focus"
            data-error={
              descriptionHasBeenBlurred ? descriptionErrorMessage : null
            }
          >
            <textarea
              name={NAME.DESCRIPTION}
              maxLength={maxSymbols}
              id="offer-description"
              onBlur={() => setDescriptionHasBeenBlurred(true)}
              onChange={(e) =>
                descriptionValueReceiver(e.target ? e.target.value : null)
              }
              form="offer-form"
            ></textarea>
          </div>
          <span className="limit">
            {description ? description.length : 0} / {maxSymbols}
          </span>
        </div>
      </div>
      <div ref={conditionTarget} className="row">
        <div className="field">
          <span className="label">Condition</span>
        </div>
        <div className="radio-container flex center">
          <div className="field radio-label">
            <label data-condition="new" htmlFor="condition-new">
              New
            </label>
            <input
              className="hidden"
              id="condition-new"
              value="new"
              type="radio"
              onClick={(e) => selectLabel(e.target)}
            />
          </div>
          <div className="field radio-label">
            <label data-condition="used" htmlFor="condition-used">
              Used
            </label>
            <input
              className="hidden"
              id="condition-used"
              value="used"
              type="radio"
              onClick={(e) => selectLabel(e.target)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewOfferGeneral;
