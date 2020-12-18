import React, { useState, useEffect, useRef, useContext } from 'react'

import Categories from "../components/Categories"
import FormUploadPhoto from "../components/FormUploadPhoto"
import FormGeneral from "../components/FormGeneral"
import FormDescription from "../components/FormDescription"
import FormPrice from "../components/FormPrice"
import FormDate from "../components/FormDate"

import { SellerContext, Seller } from "../contexts/Seller"

import { NAME } from "../helpers/Dictionary"

// switch with 'change', if you want to trigger on completed input, instead on each change
const listenerType = 'input'

const inputFallback = {
  [NAME.SELLER_DEPOSIT_C]: 'eth',
  [NAME.PRICE_C]: 'eth',
}

function NewOffer() {
  const screenController = useRef()
  const sellerContext = useContext(SellerContext)
  const [imageUploaded, setImageUploaded] = useState('')
  const [init, triggerInit] = useState(1)
  const activeScreen = sellerContext.state.offeringProgress
  const inScreenRange = (target) => (target >= 0 && target < screens.length)

  const setActiveScreen = (target) => inScreenRange(target) && sellerContext.dispatch(Seller.setOfferingProgress(target))

  const resetOfferingData = () => {
    localStorage.removeItem('offeringData')
    sellerContext.dispatch(Seller.resetOfferingData())
    loadValues(true) // call with reset
  }

  const screens = [
    <Categories listenerType={listenerType} />,
    <FormUploadPhoto imageUploaded={imageUploaded} setImageUploaded={setImageUploaded} />,
    <FormGeneral />,
    <FormDescription />,
    <FormPrice />,
    <FormDate />,
  ]
  const updateData = (input) => {
    console.log(input.value)
    sellerContext.dispatch(Seller.updateOfferingData({
      [input.name]: input.value
    }))
  }

  const loadValues = (reset) => {
    console.log(sellerContext.state.offeringData)
    Array.from(screenController.current.querySelectorAll('[name]')).forEach(input => {
      if(reset) {
        input.value = null
        return
      }

      let retrieveState = sellerContext.state.offeringData[input.name]

      input.value = retrieveState ? retrieveState : (inputFallback[input.name] ? inputFallback[input.name] : null)
      input.addEventListener(listenerType, (e) => updateData(e.target))
    })
  }

  // check for backup data
  useEffect(() => {
    // check for data
    localStorage.getItem('offeringData') &&
    sellerContext.dispatch(Seller.loadOfferingBackup())

    // check for page
    localStorage.getItem('offeringProgress') &&
    sellerContext.dispatch(Seller.getOfferingProgress())

    triggerInit(init * -1)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadValues()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScreen, init])

  // show state on each change
  // useEffect(() => {
  //   console.log('after', sellerContext.state.offeringData)
  // }, [sellerContext.state.offeringData])

  return (
    <section className="new-offer">
      <div className="container">
        <div className="top-navigation flex ai-center">
          <div className="back-button" role="button" onClick={() => setActiveScreen(activeScreen - 1)}></div>
          <div className="progress-bar flex center">
            {screens.map((screen, id) => <div key={id} className={`bar ${id <= activeScreen ? 'fill' : ''}`} role="button" onClick={() => setActiveScreen(id)}></div>)}
          </div>
        </div>
        <div className="screen">
          <form id="offer-form">
            <div ref={screenController} className="screen-controller">
              {screens[activeScreen]}
            </div>
          </form>
        </div>
        <div className="bottom-navigation flex jc-sb">
          <div className="button primary" role="button"
            onClick={resetOfferingData}
            disabled={!localStorage.getItem('offeringData') ? true : false} >
            RESET
          </div>
          <div className="bind">
            <div className="button primary" role="button"
              onClick={() => setActiveScreen(activeScreen - 1)}
              disabled={activeScreen === 0 ? true : false} >
              BACK
            </div>
            <div className="button primary" role="button"
              onClick={() => setActiveScreen(activeScreen + 1)}
              disabled={activeScreen === screens.length - 1 ? true : false} >
              NEXT
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewOffer
