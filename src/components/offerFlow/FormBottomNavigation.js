import React, { useEffect, useState, useContext } from 'react'

import { SellerContext, getData } from "../../contexts/Seller"

import { NAME } from "../../helpers/Dictionary"

import SubmitForm from "./SubmitForm"

function FormBottomNavigation(props) {
  const { lastScreenBoolean, resetOfferingData, activeScreen, setActiveScreen, screenController } = props
  const [disabled, setDisabled] = useState(true)

  const sellerContext = useContext(SellerContext)
  const getOfferingData = getData(sellerContext.state.offeringData)

  const screenFields = {
    0: [
      [NAME.CATEGORY],
    ],
    1: [
      [NAME.SELECTED_FILE],
    ],
    2: [
      [NAME.TITLE],
      [NAME.QUANTITY],
      [NAME.CONDITION],
    ],
    3: [
      [NAME.DESCRIPTION],
    ],
    4: [
      [NAME.PRICE],
      [NAME.SELLER_DEPOSIT],
      [NAME.BUYER_DEPOSIT],
    ],
    5: [
      [NAME.DATE_START],
      [NAME.DATE_END],
    ],
  }

  // check if all fields are filled with no errors
  useEffect(() => {
    setDisabled(false)

    if(screenFields[activeScreen]) {
      screenFields[activeScreen].forEach((field) => {
        if(getOfferingData(field[0]) === undefined || !!screenController.current.querySelector("[data-error]")) setDisabled(true)
      }) 
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScreen, sellerContext.state.offeringData])
  
  return (
    <div className={`bottom-navigation relative${lastScreenBoolean ? ' offer' : ''}`}>
      <div className="button static hide-disabled" role="button"
        onClick={resetOfferingData}
        disabled={!localStorage.getItem('offeringData') ? true : false} >
        START OVER
      </div>
      <SubmitForm resetOfferingData={resetOfferingData} />
      <div className="button primary" role="button"
        onClick={() => setActiveScreen(activeScreen + 1)}
        disabled={disabled} >
        NEXT
      </div>
    </div>
  )
}

export default FormBottomNavigation
