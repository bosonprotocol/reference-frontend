import React from 'react'

import { NAME } from "../helpers/Dictionary"

function FormGeneral() {
  return (
    <div className="general">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-title">
            <div className="step-title">
              <h1>Title</h1>
            </div>
          </label>
          <input id="offer-title" type="text" name={NAME.TITLE} />
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-quantity">Quantity</label>
          <input id="offer-quantity" type="number" name={NAME.QUANTITY}/>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="condition-new">New</label>
          <input id="condition-new" value="new" name={NAME.CONDITION} type="radio" />
        </div>
        <div className="field">
          <label htmlFor="condition-used">Used</label>
          <input id="condition-used" value="used" name={NAME.CONDITION} type="radio" />
        </div>
      </div>
    </div>
  )
}

export default FormGeneral
