import React from 'react'

function FormDate(props) {
  const { updateData } = props

  return (
    <div className="date">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-start-date">Start Date</label>
          <input id="offer-start-date" type="date"
          onChange={(e) => updateData('start_date', e.target.value)}/>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-expiry-date">Expiry Date</label>
          <input id="offer-expiry-date" type="date"
          onChange={(e) => updateData('end_date', e.target.value)}/>
        </div>
      </div>
    </div>
  )
}

export default FormDate
