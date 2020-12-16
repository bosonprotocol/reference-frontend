import React, { useState, useEffect, useRef } from 'react'

import Categories from "../components/Categories"
import FormUploadPhoto from "../components/FormUploadPhoto"
import FormGeneral from "../components/FormGeneral"
import FormDescription from "../components/FormDescription"
import FormPrice from "../components/FormPrice"
import FormDate from "../components/FormDate"

import { NAME } from "../helpers/Dictionary"

const inputDefinitions = {}

Object.entries(NAME).map((name) => 
inputDefinitions[name[1]] = null
)

// switch with 'change', if you want to trigger on completed input, instead on each change
const listenerType = 'input'

function NewOffer() {
  const [activeScreen, setActiveScreen] = useState(0)
  const [inputData, setInputData] = useState(inputDefinitions)
  const screenController = useRef()

  const updateData = (field, value) => {
    setInputData({
      ...inputData,
      [field]: value
    })
  }

  const test = (e) => {
    console.log(e.target.name)
    console.log(e.target.value)
  }

  const screens = [
    <Categories updateData={updateData} listenerType={listenerType} />,
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
    Array.from(screenController.current.querySelectorAll('[name]')).map(input =>
      input.addEventListener(listenerType, (e) => test(e))
    )
  }, [activeScreen])

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
            <div ref={screenController} className="screen-controller">
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
