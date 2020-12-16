import React from 'react'

function FormDate(props) {
  const { updateData } = props

  return (
    <div className="date">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-start-date">Start Date</label>
          <input id="offer-start-date" name="start_date" type="date"/>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-expiry-date">Expiry Date</label>
          <input id="offer-expiry-date" name="end_date" type="date"/>
        </div>
      </div>
    </div>
  )
}

export default FormDate
