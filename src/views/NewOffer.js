import React, { useState, useEffect, useRef, useContext } from 'react'

import "../components/ProductView.scss"

import { useHistory } from "react-router"

import "./NewOffer.scss"

import Categories from "../components/Categories"
import FormUploadPhoto from "../components/FormUploadPhoto"
import FormGeneral from "../components/FormGeneral"
import FormDescription from "../components/FormDescription"
import FormPrice from "../components/FormPrice"
import FormDate from "../components/FormDate"
import FormSummary from "../components/FormSummary"

import { SellerContext, Seller } from "../contexts/Seller"
import { Arrow } from "../components/Icons"

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
  const history = useHistory()

  const setActiveScreen = (target, backToHome) => {

    return backToHome ? history.goBack() :
    inScreenRange(target) && sellerContext.dispatch(Seller.setOfferingProgress(target))
  }

  const resetOfferingData = () => {
    localStorage.removeItem('offeringData')
    sellerContext.dispatch(Seller.resetOfferingData())
    loadValues(true) // call with reset
    sellerContext.dispatch(Seller.setOfferingProgress(0))
  }

  const screens = [
    <Categories listenerType={listenerType} />,
    <FormUploadPhoto imageUploaded={imageUploaded} setImageUploaded={setImageUploaded} />,
    <FormGeneral />,
    <FormDescription />,
    <FormPrice />,
    <FormDate />,
    <FormSummary imageUploaded={imageUploaded} />,
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

  // check for backup
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
      <div className="container l flex column jc-sb">
        <div className="bind column">
          <div className="top-navigation flex ai-center">
            <div className="button square" role="button"
              onClick={() => setActiveScreen(activeScreen - 1, activeScreen === 0)} >
              <Arrow />
            </div>
            <div className="progress-bar flex center">
              {screens.map((screen, id) => <div
                key={id} role="button"
                className={`bar ${id <= activeScreen ? 'fill' : ''}`}
                onClick={() => setActiveScreen(id)}><span></span></div>)}
            </div>
          </div>
          <div className="screen">
            <form id="offer-form">
              <div ref={screenController} className="screen-controller">
                {screens[activeScreen]}
              </div>
            </form>
          </div>
        </div>
        <div className="bottom-navigation relative">
          <div className="button static hide-disabled" role="button"
            onClick={resetOfferingData}
            disabled={!localStorage.getItem('offeringData') ? true : false} >
            START OVER
          </div>
          <div className="button primary" role="button"
            onClick={() => setActiveScreen(activeScreen + 1)}
            disabled={activeScreen === screens.length - 1 ? true : false} >
            NEXT
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewOffer
