import React, { useRef, useContext, forwardRef, useEffect } from 'react'

import { SellerContext, Seller, getData } from "../../contexts/Seller"

import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
// https://www.npmjs.com/package/react-datepicker

import { NAME } from "../../helpers/Dictionary"

function FormDate() {
  const sellerContext = useContext(SellerContext)
  const startDate = useRef()
  const endDate = useRef()
  const dateRef = {
    [NAME.DATE_START]: useRef(),
    [NAME.DATE_END]: useRef(),
  }

  const yesterday = new Date().setDate(new Date().getDate() - 1)

  const getOfferingData = getData(sellerContext.state.offeringData)

  const start_date = getOfferingData(NAME.DATE_START)
  const end_date = getOfferingData(NAME.DATE_END)

  const checkError = {
    [NAME.DATE_START]: date => (
      new Date(date).getTime() <= yesterday ? "Start Date can't be set before Today" :
      new Date(date).getTime() >= new Date(getOfferingData(NAME.DATE_END)).getTime() ? "Start Date can't be set after the Expiry Date" :
      false
    ),
    [NAME.DATE_END]: date => (
      new Date(date).getTime() <= new Date(getOfferingData(NAME.DATE_START)).getTime() ?
      "Expiry Date can't be set before Start Date." : false
    ),
  }

  const handleDateChange = (date, name) => {
    dateRef[name].current.removeAttribute('data-error')

    const error = checkError[name](date)
    error ?
    dateRef[name].current.setAttribute('data-error', error) :

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

  useEffect(() => {
    if(!!start_date) dateRef[NAME.DATE_START].current.querySelector('.field[role="button"]').classList.remove('await')
    if(!!end_date) dateRef[NAME.DATE_END].current.querySelector('.field[role="button"]').classList.remove('await')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start_date, end_date])

  const Field = forwardRef(
    ({ value, onClick, waiting }, ref) => {
      console.log(waiting)
      return <div ref={ref} className={`field ${waiting ? 'await' : ''}`} role="button" onClick={onClick}>
      {value}
    </div>
    }
  )
  

  return (
    <div className="date"> 
      <div className="row">
        <div className="field">
          <div className="step-title">
            <label htmlFor="offer-start-date">Start Date</label>
          </div>
          <div ref={dateRef[NAME.DATE_START]} className="input relative">
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
          <div ref={dateRef[NAME.DATE_END]} className="input relative">
            <DatePicker
              id="offer-expiry-date" name={NAME.DATE_END}
              
              selected={setDefaultValue(NAME.DATE_END)}
              onChange={(date) => handleDateChange(date, NAME.DATE_END)}
              customInput={<Field ref={endDate} waiting={true}/>}
            />
            <div className="icon"><img src="images/calendar-icon.png" alt=""/></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDate