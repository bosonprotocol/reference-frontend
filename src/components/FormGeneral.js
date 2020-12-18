import React from 'react'

import { NAME } from "../helpers/Dictionary"

function FormGeneral() {
  const selectLabel = (e) => {
    Array.from(e.target.parentElement.parentElement.querySelectorAll('label')).forEach(label => {
      label.classList.remove('active')
    })
    e.target.parentElement.querySelector('label').classList.add('active') 
  }
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
      <div className="row flex">
        <div className="field radio-label">
          <label htmlFor="condition-new">New</label>
          <input className="hidden" id="condition-new" value="new" type="radio" 
          name={NAME.CONDITION} 
          onClick={(e) => selectLabel(e)} />
        </div>
        <div className="field radio-label">
          <label htmlFor="condition-used">Used</label>
          <input className="hidden" id="condition-used" value="used" type="radio"
          name={NAME.CONDITION} 
          onClick={(e) => selectLabel(e)} />
        </div>
      </div>
    </div>
  )
}

export default FormGeneral
