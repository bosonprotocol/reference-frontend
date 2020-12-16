import React, { useState, useEffect } from 'react'

import Categories from "../components/Categories"
import FormUploadPhoto from "../components/FormUploadPhoto"
import FormGeneral from "../components/FormGeneral"
import FormDescription from "../components/FormDescription"
import FormPrice from "../components/FormPrice"
import FormDate from "../components/FormDate"

const inputDefinitions = {
  category: null,
  image: null,
  title: null,
  quantity: null,
  condition: null,
  description: null,
  price_currency: null,
  price: null,
  seller_deposit_currency: null,
  seller_deposit: null,
  buyer_deposit: null,
  start_date: null,
  end_date: null
}

function NewOffer() {
  const [activeScreen, setActiveScreen] = useState(0)
  const [inputData, setInputData] = useState(inputDefinitions)

  const updateData = (field, value) => {
    setInputData({
      ...inputData,
      [field]: value
    })
  }

  const screens = [
    <Categories updateData={updateData} />,
    <FormUploadPhoto updateData={updateData} />,
    <FormGeneral updateData={updateData} />,
    <FormDescription updateData={updateData} />,
    <FormPrice updateData={updateData} />,
    <FormDate updateData={updateData} />,
  ]

  const switchScreen = (target) => {
    setActiveScreen(target)
  }

  useEffect(() => {
    console.log(inputData)
  }, [inputData])

  return (
    <section className="new-offer">
      <div className="container">
        <div className="top-navigation flexa ai-center">
          <div className="back-button" role="button" onClick={() => switchScreen(activeScreen + 1)}></div>
          <div className="progress-bar flex center">
            {screens.map((screen, id) => <div key={id} className={`bar ${id <= activeScreen ? 'fill' : ''}`} role="button" onClick={() => switchScreen(id)}></div>)}
          </div>
        </div>
        <div className="screen">
          <form id="offer-form">
            <div className="screen-controller">
              {screens[activeScreen]}
            </div>
          </form>
        </div>
        <div className="bottom-navigation flex jc-end">
          <div className="button primary" role="button" onClick={() => switchScreen(activeScreen + 1)}>NEXT</div>
        </div>
      </div>
    </section>
  )
}

export default NewOffer
