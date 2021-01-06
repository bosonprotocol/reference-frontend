import React, { useState, useEffect, useRef, useContext } from 'react'

import "../components/shared/ProductView.scss"

import { useHistory } from "react-router"

import "./NewOffer.scss"

import Categories from "../components/offerFlow/Categories"
import FormUploadPhoto from "../components/offerFlow/FormUploadPhoto"
import FormGeneral from "../components/offerFlow/FormGeneral"
import FormDescription from "../components/offerFlow/FormDescription"
import FormPrice from "../components/offerFlow/FormPrice"
import FormDate from "../components/offerFlow/FormDate"
import FormSummary from "../components/offerFlow/FormSummary"
import FormBottomNavigation from "../components/offerFlow/FormBottomNavigation"

import { SellerContext, Seller } from "../contexts/Seller"
import { Arrow } from "../components/shared/Icons"

import { NAME, CURRENCY } from "../helpers/Dictionary"

// switch with 'change', if you want to trigger on completed input, instead on each change
const listenerType = 'input'

const inputFallback = {
  [NAME.PRICE_C]: CURRENCY.ETH,
  [NAME.SELLER_DEPOSIT_C]: CURRENCY.BSN,
}

function NewOffer() {
  const screenController = useRef()
  const sellerContext = useContext(SellerContext)
  const [imageUploaded, setImageUploaded] = useState('')
  const [init, triggerInit] = useState(1)
  const activeScreen = sellerContext.state.offeringProgress
  const inScreenRange = (target) => (target >= 0 && target < screens.length)
  const history = useHistory()
  const [selectedFile, setSelectedFile] = useState('');

  const screens = [
    <Categories listenerType={listenerType} />,
    <FormUploadPhoto 
      imageUploaded={imageUploaded} 
      setImageUploaded={setImageUploaded} 
      setSelectedFile={setSelectedFile}
      />,
    <FormGeneral />,
    <FormDescription />,
    <FormPrice />,
    <FormDate />,
    <FormSummary imageUploaded={imageUploaded} />,
  ]

  const lastScreenBoolean = activeScreen === screens.length - 1

  const setActiveScreen = (target, backToHome) => {

    return backToHome ? history.goBack() :
    inScreenRange(target) && sellerContext.dispatch(Seller.setOfferingProgress(target))
  }

  const resetOfferingData = () => {
    localStorage.removeItem('offeringData')
    sellerContext.dispatch(Seller.resetOfferingData())
    loadValues(true) // call with reset
    sellerContext.dispatch(Seller.setOfferingProgress(0))
    
    // remove class active from active screen
    removeActiveItems()
  }

  const removeActiveItems = () => {
    screenController.current.querySelectorAll('.active').forEach(item => {
      item.classList.remove('active')
    })
  }

  const currencyList = Object.keys(CURRENCY)

  const updateData = (input) => {
    if(input.tagName === 'SELECT') {
      currencyList.map(currency => 
        input.parentElement.getElementsByClassName('icons')[0].classList.remove(currency)
      )

      setTimeout(() => {
        input.parentElement.getElementsByClassName('icons')[0].classList.add(`${input.value}`)
      }, 100)
    }
    // input.classList.add(input.value)
    sellerContext.dispatch(Seller.updateOfferingData({
      [input.name]: input.value
    }))
  }

  const loadValues = (reset) => {
    Array.from(screenController.current.querySelectorAll('[name]')).forEach(input => {
      if(reset) {
        input.value = null
        return
      }

      let retrieveState = sellerContext.state.offeringData[input.name]

      // currencies
      if(input.tagName === 'SELECT') {
        let assign = retrieveState ? retrieveState :
          (inputFallback[input.name] ? inputFallback[input.name] : '')
        
        currencyList.map(currency => 
          input.parentElement.getElementsByClassName('icons')[0].classList.remove(currency)
        )
        console.log(sellerContext.state.offeringData)
        input.parentElement.getElementsByClassName('icons')[0].classList.add(assign)
      } 

      input.value = retrieveState ? retrieveState : (inputFallback[input.name] ? inputFallback[input.name] : null)
      input.addEventListener(listenerType, (e) => updateData(e.target))
    })
  }

  useEffect(() => {
    loadValues()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScreen, init])

  // check for backup
  useEffect(() => {
    // check for data
    localStorage.getItem('offeringData') ?
    sellerContext.dispatch(Seller.loadOfferingBackup()) :
    sellerContext.dispatch(Seller.updateOfferingData({
      [NAME.SELLER_DEPOSIT_C]: inputFallback[NAME.SELLER_DEPOSIT_C],
      [NAME.PRICE_C]: inputFallback[NAME.PRICE_C],
      [NAME.PRICE_SUFFIX]: `0 ${inputFallback[NAME.PRICE_C]}`,
      [NAME.SELLER_SUFFIX]: `0 ${inputFallback[NAME.SELLER_DEPOSIT_C]}`,
    }))

    // check for page
    localStorage.getItem('offeringProgress') &&
    sellerContext.dispatch(Seller.getOfferingProgress())

    triggerInit(init * -1)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // show state on each change
  useEffect(() => {
    console.log('after', sellerContext.state.offeringData)
  }, [sellerContext.state.offeringData, selectedFile])

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
        <FormBottomNavigation 
          lastScreenBoolean={lastScreenBoolean}
          resetOfferingData={resetOfferingData}
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          selectedFile={selectedFile}
        />
      </div>
    </section>
  )
}

export default NewOffer
