import React, { useRef, useContext, forwardRef, useEffect } from 'react'

import { SellerContext, Seller, getData } from "../../contexts/Seller"

import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
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

  const start_date = getOfferingData(NAME.DATE_START)
  const end_date = getOfferingData(NAME.DATE_END)
 

  const setDefaultValue = (name) => {
    let def = getOfferingData(name)
    return (
      def ?
        new Date(def) :
        new Date()
    )
  }

  useEffect(() => {
    start_date && dateRef[NAME.DATE_START].current.querySelector('.field[role="button"]').classList.remove('await')
    end_date && dateRef[NAME.DATE_END].current.querySelector('.field[role="button"]').classList.remove('await')
  }, [start_date, end_date])

  const Field = forwardRef(
    ({ value, onClick }, ref) => (
      <div ref={ref} className="field" role="button" onClick={onClick}>
        {value}
      </div>
    )
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
             
              selected={setDefaultValue(NAME.DATE_START)}
              onChange={(date) => startDateValueReceiver(date)}
              customInput={<Field ref={startDate} />}
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
            

              selected={setDefaultValue(NAME.DATE_END)}
                      
              onChange={(date) => endDateValueReceiver(date)}
              customInput={<Field ref={endDate} />}
            />
            <div className="icon"><img src="images/calendar-icon.png" alt=""/></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDate