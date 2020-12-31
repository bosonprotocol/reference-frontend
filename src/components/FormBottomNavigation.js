import React from 'react'

import SubmitForm from "./SubmitForm"

function FormBottomNavigation(props) {
  const { lastScreenBoolean, resetOfferingData, activeScreen, setActiveScreen, formData, selectedFile } = props
  
  return (
    <div className={`bottom-navigation relative${lastScreenBoolean ? ' offer' : ''}`}>
      <div className="button static hide-disabled" role="button"
        onClick={resetOfferingData}
        disabled={!localStorage.getItem('offeringData') ? true : false} >
        START OVER
      </div>
      <SubmitForm formData={formData} selectedFile={selectedFile} />
      <div className="button primary" role="button"
        onClick={() => setActiveScreen(activeScreen + 1)}
        disabled={lastScreenBoolean ? true : false} >
        NEXT
      </div>
    </div>
  )
}

export default FormBottomNavigation
