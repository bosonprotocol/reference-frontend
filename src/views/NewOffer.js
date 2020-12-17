import React, { useState, useEffect, useRef, useContext } from 'react'

import Categories from "../components/Categories"
import FormUploadPhoto from "../components/FormUploadPhoto"
import FormGeneral from "../components/FormGeneral"
import FormDescription from "../components/FormDescription"
import FormPrice from "../components/FormPrice"
import FormDate from "../components/FormDate"

import { SellerContext, Seller } from "../contexts/Seller"

// switch with 'change', if you want to trigger on completed input, instead on each change
const listenerType = 'input'

const screens = [
  <Categories listenerType={listenerType} />,
  <FormUploadPhoto />,
  <FormGeneral />,
  <FormDescription />,
  <FormPrice />,
  <FormDate />,
]

function NewOffer() {
  const [activeScreen, setActiveScreen] = useState(0)
  const screenController = useRef()
  const sellerContext = useContext(SellerContext)


  const switchScreen = (target) => {
    setActiveScreen(target)
  }

  const updateData = (input) => {
    sellerContext.dispatch(Seller.updateOfferingData({
      [input.name]: !input.files ? input.value : input.files[0]
    }))
  }

  useEffect(() => {
    Array.from(screenController.current.querySelectorAll('[name]')).forEach(input => {
      let retrieveState = sellerContext.state.offeringData[input.name]
      
      input.value = retrieveState ? retrieveState : ''
      input.addEventListener(listenerType, (e) => updateData(e.target))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScreen])

  // show state on each change
  // useEffect(() => {
  //   console.log('after', sellerContext.state.offeringData)
  // }, [sellerContext.state.offeringData])

  return (
    <section className="new-offer">
      <div className="container">
        <div className="top-navigation flex ai-center">
          <div className="back-button" role="button" onClick={() => switchScreen(activeScreen - 1)}></div>
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
          <div className="button primary" role="button" onClick={() => switchScreen(activeScreen - 1)}>Back</div>
          <div className="button primary" role="button" onClick={() => switchScreen(activeScreen + 1)}>NEXT</div>
        </div>
      </div>
    </section>
  )
}

export default NewOffer
