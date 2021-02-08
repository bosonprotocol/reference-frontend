import React, { useEffect, useState, useContext } from 'react'

import { SellerContext, getData } from "../../contexts/Seller"
import { NAME } from '../../helpers/Dictionary'


import SubmitForm from "./SubmitForm"

function FormBottomNavigation(props) {
  const { lastScreenBoolean, activeScreen, setActiveScreen, errorMessages } = props
  const [disabled, setDisabled] = useState(true)


  const sellerContext = useContext(SellerContext)
  const getOfferingData = getData(sellerContext.state.offeringData)

  const screenFields = {
    0: [
      [NAME.CATEGORY],
    ],
    1: [
      [NAME.IMAGE],
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
    if(activeScreen !== undefined && activeScreen !== null &&  screenFields[activeScreen]) {
      let disable = false;
      const activeScreenFieldNames = screenFields[activeScreen].map(x => x[0]);
      if(screenFields[activeScreen]) {
        activeScreenFieldNames.forEach((field) => {
          if(!getOfferingData(field)) {
            disable = true;
          }
        }) 
      }
      console.log(errorMessages)
      Object.keys(errorMessages).forEach((key) => {
        if(errorMessages[key] && activeScreenFieldNames.includes(key)) {
          disable = true;
        }
      })
      setDisabled(disable);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScreen, sellerContext.state.offeringData, errorMessages])
  
  return (
    <div className={`bottom-navigation relative${lastScreenBoolean ? ' offer' : ''}`}>
      <SubmitForm/>
      <div className="button primary" role="button"
        onClick={() => setActiveScreen(activeScreen + 1)}
        disabled={disabled} >
        NEXT
      </div>
    </div>
  )
}

export default FormBottomNavigation
