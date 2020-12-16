import React, { useState } from 'react'

import Categories from "../components/Categories"
import FormUploadPhoto from "../components/FormUploadPhoto"
import FormGeneral from "../components/FormGeneral"
import FormDescription from "../components/FormDescription"
import FormPrice from "../components/FormPrice"
import FormDate from "../components/FormDate"

const screens = [
  <Categories />,
  <FormUploadPhoto />,
  <FormGeneral />,
  <FormDescription />,
  <FormPrice />,
  <FormDate />,
]

function NewOffer() {
  const [activeScreen, setActiveScreen] = useState(0)

  const switchScreen = () => {
    console.log('switch')
  }

  return (
    <section className="new-offer">
      <div className="container">
        <div className="top-navigation flexa ai-center">
          <div className="back-button"></div>
          <div className="progress-bar flex center">
            {screens.map((screen, id) => <div key={id} className={`bar ${id <= activeScreen ? 'fill' : ''}`} role="button" onClick={switchScreen}></div>)}
          </div>
        </div>
        <div className="screen">
          <form id="offer-form">
            <div className="screen-controller">
              {screens[activeScreen]}
            </div>
          </form>
        </div>
        <div className="bottom-navigation"></div>
      </div>
    </section>
  )
}

export default NewOffer
