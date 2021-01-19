import React, { useRef, useContext, forwardRef } from 'react'

import { SellerContext, Seller, getData } from "../../contexts/Seller"

import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
// https://www.npmjs.com/package/react-datepicker

import { NAME } from "../../helpers/Dictionary"

function FormDate() {
  const sellerContext = useContext(SellerContext)
  const startDate = useRef()
  const endDate = useRef()

  const getOfferingData = getData(sellerContext.state.offeringData)

  const handleDateChange = (date, name) => {
    sellerContext.dispatch(Seller.updateOfferingData({
      [name]: date
    }))
  }

  const setDefaultValue = (name) => {
    let def = getOfferingData(name)
    return (
      def ?
        new Date(def) :
        new Date()
    )
  }

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
          <div className="input relative">
            <DatePicker
              id="offer-start-date" name={NAME.DATE_START}
              
              selected={setDefaultValue(NAME.DATE_START)}
              onChange={(date) => handleDateChange(date, NAME.DATE_START)}
              customInput={<Field ref={startDate} />}
            />
            <div className="icon"><img src="images/calendar-icon.png" alt=""/></div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-expiry-date">Expiry Date</label>
          <div className="input relative">
            <DatePicker
              id="offer-expiry-date" name={NAME.DATE_END}
              
              selected={setDefaultValue(NAME.DATE_END)}
              onChange={(date) => handleDateChange(date, NAME.DATE_END)}
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