import React from 'react'

import { NAME } from "../helpers/Dictionary"

function FormDate() {
  return (
    <div className="date">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-start-date">Start Date</label>
          <input id="offer-start-date" name={NAME.DATE_START} type="date"/>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-expiry-date">Expiry Date</label>
          <input id="offer-expiry-date" name={NAME.DATE_END} type="date"/>
        </div>
      </div>
    </div>
  )
}

export default FormDate
