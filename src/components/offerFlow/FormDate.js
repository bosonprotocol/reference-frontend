import React, { useRef, useContext, forwardRef, useState } from "react";

import { SellerContext, getData } from "../../contexts/Seller";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./FormDate.scss";
// https://www.npmjs.com/package/react-datepicker

import { Arrow } from "../shared/Icons";
import { NAME } from "../../helpers/Dictionary";

function FormDate({
  startDateValueReceiver,
  endDateValueReceiver,
  startDateErrorMessage,
  endDateErrorMessage,
}) {
  const sellerContext = useContext(SellerContext);
  const startDate = useRef();
  const endDate = useRef();
  const [startDateCalendarOpen, setStartDateCalendarOpen] = useState(false);
  const [endDateCalendarOpen, setEndDateCalendarOpen] = useState(false);

  const dateRef = {
    [NAME.DATE_START]: useRef(),
    [NAME.DATE_END]: useRef(),
  };
  const calendarStartRef = useRef();
  const calendarEndRef = useRef();

  let saveButtonClicked = false;
  const getOfferingData = getData(sellerContext.state.offeringData);

  const [
    currentlySelectedStartDateWhileCalendarOpen,
    setCurrentlySelectedStartDateWhileCalendarOpen,
  ] = useState(
    getOfferingData(NAME.DATE_START) || new Date().setHours(0, 0, 0, 0)
  );
  const [
    currentlySelectedEndDateWhileCalendarOpen,
    setCurrentlySelectedEndDateWhileCalendarOpen,
  ] = useState(getOfferingData(NAME.DATE_END));

  const end_date = getOfferingData(NAME.DATE_END);

  const startDateCalendarOpened = () => {
    setStartDateCalendarOpen(true);
  };
  const endDateCalendarOpened = () => {
    setEndDateCalendarOpen(true);
  };

  const startDateCalendarClosed = () => {
    setTimeout(() => {
      if (saveButtonClicked) {
        startDateValueReceiver(currentlySelectedStartDateWhileCalendarOpen);
        saveButtonClicked = false;
      } else {
        setCurrentlySelectedStartDateWhileCalendarOpen(
          getOfferingData(NAME.DATE_START)
        );
      }

      setStartDateCalendarOpen(false);
    }, 125);
  };
  const endDateCalendarClosed = (e) => {
    setTimeout(() => {
      if (saveButtonClicked) {
        endDateValueReceiver(currentlySelectedEndDateWhileCalendarOpen);
        saveButtonClicked = false;
      } else {
        setCurrentlySelectedEndDateWhileCalendarOpen(
          getOfferingData(NAME.DATE_END)
        );
      }
      setEndDateCalendarOpen(false);
    }, 125);
  };

  const Field = forwardRef(({ value, onClick, dateFieldType }, ref) => {
    return (
      <div
        ref={ref}
        className={`field ${
          !end_date && dateFieldType === NAME.DATE_END ? "await" : ""
        }`}
        role="button"
        onClick={onClick}
      >
        {value}
      </div>
    );
  });

  return (
    <div className="date">
      <div className="row">
        <div className="field">
          <div className="step-title">
            <label htmlFor="offer-start-date">Start Date</label>
          </div>
          <div
            ref={dateRef[NAME.DATE_START]}
            className="input relative"
            data-error={startDateErrorMessage}
          >
            <DatePicker
              ref={calendarStartRef}
              id="offer-start-date"
              wrapperClassName="datePicker"
              withPortal
              shouldCloseOnSelect={false}
              calendarClassName="react-datepicker-custom"
              selected={currentlySelectedStartDateWhileCalendarOpen}
              onChange={(date) =>
                setCurrentlySelectedStartDateWhileCalendarOpen(
                  date.setHours(0, 0, 0, 0)
                )
              }
              customInput={
                <Field ref={startDate} dateFieldType={NAME.DATE_START} />
              }
              onCalendarOpen={(e) => startDateCalendarOpened(e)}
              onCalendarClose={(e) => startDateCalendarClosed(e)}
            />
            <div className="icon">
              <img src="images/icons/calendar-icon.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-expiry-date">Expiry Date</label>
          <div
            ref={dateRef[NAME.DATE_END]}
            data-error={endDateErrorMessage}
            className="input relative"
          >
            <DatePicker
              ref={calendarEndRef}
              id="offer-expiry-date"
              wrapperClassName="datePicker"
              withPortal
              shouldCloseOnSelect={false}
              selected={currentlySelectedEndDateWhileCalendarOpen}
              onChange={(date) =>
                setCurrentlySelectedEndDateWhileCalendarOpen(
                  date.setHours(23, 59, 59, 999)
                )
              }
              customInput={
                <Field ref={endDate} dateFieldType={NAME.DATE_END} />
              }
              onCalendarOpen={(e) => endDateCalendarOpened(e)}
              onCalendarClose={(e) => endDateCalendarClosed(e)}
            />
            <div className="icon">
              <img src="images/icons/calendar-icon.png" alt="" />
            </div>
            <div
              className="container calendar-controls"
              hidden={!startDateCalendarOpen && !endDateCalendarOpen}
            >
              <div className="anchor">
                <button
                  className="calendar-save-button"
                  onClick={(e) => {
                    e.preventDefault();
                    saveButtonClicked = true;
                  }}
                >
                  SAVE
                </button>
                <div className="button square new" role="button">
                  <Arrow color="#80F0BE" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormDate;
