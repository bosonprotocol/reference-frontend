import React from 'react'

function FormGeneral() {
  return (
    <div className="general">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-title">
            <h1>Title</h1>
          </label>
          <input id="offer-title" type="text"/>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-quantity">Quantity</label>
          <input id="offer-quantity" type="number"/>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="condition-new">New</label>
          <input id="condition-new" name="condition" type="radio"/>
        </div>
        <div className="field">
          <label htmlFor="condition-used">Used</label>
          <input id="condition-used" name="condition" type="radio"/>
        </div>
      </div>
    </div>
  )
}

export default FormGeneral
