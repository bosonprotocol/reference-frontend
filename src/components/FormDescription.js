import React from 'react'

function FormDescription() {
  return (
    <div className="description">
      <div className="row">
        <div className="field">
        <label htmlFor="offer-description">
            <h1>Description</h1>
          </label>
          <textarea id="offer-description" name="description" form="offer-form"></textarea>
        </div>
      </div>
    </div>
  )
}

export default FormDescription
