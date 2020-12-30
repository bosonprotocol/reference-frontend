import React from 'react'

import SubmitForm from "./SubmitForm"

function FormBottomNavigation(props) {
  const { lastScreenBoolean, resetOfferingData, activeScreen, setActiveScreen, formData } = props
  
  return (
    <div className={`bottom-navigation relative${lastScreenBoolean ? ' offer' : ''}`}>
      <div className="button static hide-disabled" role="button"
        onClick={resetOfferingData}
        disabled={!localStorage.getItem('offeringData') ? true : false} >
        START OVER
      </div>
      <SubmitForm formData={formData} />
      <div className="button primary" role="button"
        onClick={() => setActiveScreen(activeScreen + 1)}
        disabled={lastScreenBoolean ? true : false} >
        NEXT
      </div>
    </div>
  )
}

export default FormBottomNavigation
