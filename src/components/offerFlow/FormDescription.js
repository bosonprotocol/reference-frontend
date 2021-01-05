import React from 'react'

import { NAME } from "../../helpers/Dictionary"

function FormDescription() {
  return (
    <div className="description">
      <div className="row">
        <div className="field">
        <label htmlFor="offer-description">
            <div className="step-title">
              <h1>Description</h1>
            </div>
          </label>
          <textarea id="offer-description" name={NAME.DESCRIPTION} form="offer-form"></textarea>
        </div>
      </div>
    </div>
  )
}

export default FormDescription
