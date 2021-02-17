import React, { useRef, useContext, forwardRef, useEffect } from 'react'

import { SellerContext, getData } from "../../contexts/Seller"

import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
import "./FormDate.scss"
// https://www.npmjs.com/package/react-datepicker

import { NAME } from "../../helpers/Dictionary";

function FormDate({startDateValueReceiver, endDateValueReceiver, startDateErrorMessage, endDateErrorMessage}) {
  const sellerContext = useContext(SellerContext)
  const startDate = useRef()
  const endDate = useRef()
  const dateRef = {
    [NAME.DATE_START]: useRef(),
    [NAME.DATE_END]: useRef(),
  }

  const getOfferingData = getData(sellerContext.state.offeringData)

  const end_date = getOfferingData(NAME.DATE_END);

  useEffect(() => {
      startDateValueReceiver(null)
  })
  const getCurrentDateValue = (name) => {
    let currentValue = getOfferingData(name)

    return ( currentValue ? new Date(currentValue) : new Date()
    )
  }

  const Field = forwardRef(
    ({ value, onClick, dateFieldType} ,ref) => {
      return (
        <div ref={ref} className={`field ${!end_date && dateFieldType===NAME.DATE_END ? 'await': ''}`} role="button" onClick={onClick}>
          {value}
        </div>
      )
    }
    
  )
  

  return (
    <div className="date"> 
      <div className="row">
        <div className="field">
          <div className="step-title">
            <label htmlFor="offer-start-date">Start Date</label>
          </div>
          <div ref={dateRef[NAME.DATE_START]} className="input relative"  data-error={startDateErrorMessage}>
            <DatePicker
              id="offer-start-date" 
              wrapperClassName="datePicker"
              withPortal
              shouldCloseOnSelect={false}
              calendarClassName="react-datepicker-custom"
              selected={getCurrentDateValue(NAME.DATE_START)}
              onChange={(date) => startDateValueReceiver(date.setHours(0,0,0,0))}
              customInput={<Field ref={startDate} dateFieldType={NAME.DATE_START}/>}
            />
            <div className="icon"><img src="images/calendar-icon.png" alt=""/></div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-expiry-date">Expiry Date</label>
          <div ref={dateRef[NAME.DATE_END]}   data-error={endDateErrorMessage} className="input relative">
            <DatePicker
              id="offer-expiry-date"
              wrapperClassName="datePicker"
              withPortal
              shouldCloseOnSelect={false}
              selected={getCurrentDateValue(NAME.DATE_END)}
              onChange={(date) => endDateValueReceiver(date.setHours(23,59,59,999))}
              customInput={<Field ref={endDate} dateFieldType={NAME.DATE_END}/>}
            />
            <div className="icon"><img src="images/calendar-icon.png" alt=""/></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDate