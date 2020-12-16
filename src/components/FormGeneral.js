import React from 'react'

function FormGeneral(props) {
  const { updateData } = props

  return (
    <div className="general">
      <div className="row">
        <div className="field">
          <label htmlFor="offer-title">
            <h1>Title</h1>
          </label>
          <input id="offer-title" type="text" name="title"/>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="offer-quantity">Quantity</label>
          <input id="offer-quantity" type="number" name="quantity"/>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="condition-new">New</label>
          <input id="condition-new" value="new" name="condition" type="radio"
          onChange={(e) => updateData('condition', e.target.defaultValue)}/>
        </div>
        <div className="field">
          <label htmlFor="condition-used">Used</label>
          <input id="condition-used" value="used" name="condition" type="radio"
          onChange={(e) => updateData('condition', e.target.defaultValue)}/>
        </div>
      </div>
    </div>
  )
}

export default FormGeneral
