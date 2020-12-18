import React from 'react'

import { NAME } from "../helpers/Dictionary"

function FormDate() {
  return (
    <div className="date">
      <div className="row">
        <div className="field">
          <div className="step-title">
            <label htmlFor="offer-start-date">Start Date</label>
          </div>
          <input placeholder="dd-mm-yyyy" id="offer-start-date" name={NAME.DATE_START} type="date"/>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-expiry-date">Expiry Date</label>
          <input placeholder="dd-mm-yyyy" id="offer-expiry-date" name={NAME.DATE_END} type="date"/>
        </div>
      </div>
    </div>
  )
}

export default FormDate
