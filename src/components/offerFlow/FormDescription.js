import React, { useContext } from 'react'

import { SellerContext, getData } from "../../contexts/Seller"

import { NAME } from "../../helpers/Dictionary"

function FormDescription() {
  const sellerContext = useContext(SellerContext)

  const getOfferingData = getData(sellerContext.state.offeringData)

  const description = getOfferingData(NAME.DESCRIPTION)
  const maxSymbols = 160

  return (
    <div className="description">
      <div className="row">
        <div className="field">
        <label htmlFor="offer-description">
            <div className="step-title">
              <h1>Description</h1>
            </div>
          </label>
          <div className="area relative">
            <div className="input focus">
              <textarea 
                maxLength={maxSymbols} id="offer-description" name={NAME.DESCRIPTION} form="offer-form">              
              </textarea>
            </div>
            <span className="limit">{description ? description.length : 0} / {maxSymbols}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDescription
