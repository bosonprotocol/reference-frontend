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

import { GetToday } from "../helpers/Misc"

// switch with 'change', if you want to trigger on completed input, instead on each change
const listenerType = 'change'

const priceSettings = {
  [CURRENCY.ETH]: {
    max: 2
  },
  [CURRENCY.BSN]: {
    max: 1.8
  }
}

const sellerSettings = { 
  [CURRENCY.ETH]: {
    max: 0.1
  },
  [CURRENCY.BSN]: {
    max: 0.2
  }
}

const buyerSettings = {
  [CURRENCY.ETH]: {
    max: 0.3
  },
  [CURRENCY.BSN]: {
    max: 0.4
  }
}

const descriptionSettings = {
  min: 10
}

const quantitySettings = {
  max: 10
}

const titleSettings = {
  max: 50,
  // min: 3
}

function NewOffer() {
  const screenController = useRef()
  const sellerContext = useContext(SellerContext)
  const [init, triggerInit] = useState(1)
  const activeScreen = sellerContext.state.offeringProgress
  const inScreenRange = (target) => (target >= 0 && target < screens.length)
  const history = useHistory()

  const inputFallback = {
    [NAME.PRICE]: '0',
    [NAME.PRICE_C]: CURRENCY.ETH,
    [NAME.SELLER_DEPOSIT]: '0', 
    [NAME.SELLER_DEPOSIT_C]: CURRENCY.ETH, 
    [NAME.BUYER_DEPOSIT]: '0',
    [NAME.DATE_START]: GetToday(),
    [NAME.DATE_END]: GetToday(1),
  }

  const getData = name => sellerContext.state.offeringData[name]

  // const price = getData(NAME.PRICE)
  const priceCurrency = getData(NAME.PRICE_C)
  // const seller = getData(NAME.SELLER_DEPOSIT)
  const sellerCurrency = getData(NAME.SELLER_DEPOSIT_C)
  // const buyer = getData(NAME.BUYER_DEPOSIT)

  const validation = (input, value) => {

    // currency select inputs
    if(input === NAME.SELLER_DEPOSIT_C) {
      if(getData(NAME.SELLER_DEPOSIT)) {
        if(getData(NAME.SELLER_DEPOSIT) > sellerSettings[value].max) {
          
          sellerContext.dispatch(Seller.updateOfferingData({
            [NAME.SELLER_DEPOSIT]: sellerSettings[value].max
          }))
        }
      }

      return false
    }
    else if(input === NAME.PRICE_C) {
      if(getData(NAME.PRICE) > priceSettings[value].max) sellerContext.dispatch(Seller.updateOfferingData({
        [NAME.PRICE]: priceSettings[value].max
      }))
      if(getData(NAME.BUYER_DEPOSIT) > buyerSettings[value].max) sellerContext.dispatch(Seller.updateOfferingData({
        [NAME.BUYER_DEPOSIT]: buyerSettings[value].max
      }))

      return false
    }

    // price number inputs
    else if(input === NAME.PRICE && getData(NAME.PRICE_C)) {
      if(isNaN(parseInt(value))) return 'Must be a valid number'
      if(value <= 0) return 'Value cannot less or equal to 0'
      if(value > priceSettings[priceCurrency].max) return `The maximum value is ${priceSettings[priceCurrency].max}`

      return false
    }
    else if(input === NAME.SELLER_DEPOSIT && getData(NAME.SELLER_DEPOSIT_C)) {
      if(isNaN(parseInt(value))) return 'Must be a valid number'
      if(value <= 0) return 'Value cannot less or equal to 0'
      if(value > sellerSettings[sellerCurrency].max) return `The maximum value is ${sellerSettings[sellerCurrency].max}`

      return false
    }
    else if(input === NAME.BUYER_DEPOSIT && getData(NAME.PRICE_C)) {
      if(isNaN(parseInt(value))) return 'Must be a valid number'
      if(value <= 0) return 'Value cannot less or equal to 0'
      if(value > buyerSettings[priceCurrency].max) return `The maximum value is ${buyerSettings[priceCurrency].max}`

      return false
    }

    // description
    else if(input === NAME.DESCRIPTION) {
      if(value.length < descriptionSettings.min) {
        sellerContext.dispatch(Seller.updateOfferingData({
          [input]: value
        }))

        return `Desciption must be at least ${descriptionSettings.min} characters`
      }

      return false
    }

    // general
    else if(input === NAME.QUANTITY) {
      if(isNaN(parseInt(value))) return 'Must be a valid number'
      if(value <= 0) return 'Value cannot less or equal to 0'
      if(value > quantitySettings.max) return `Maximum quantity is ${quantitySettings.max}`

      return false
    }
    else if(input === NAME.TITLE) {
      if(value.length <= titleSettings.min) return `Title must be at least ${titleSettings.min + 1} characters long`
      if(value.length > titleSettings.max) return `Title can't more than ${titleSettings.max} characters long`

      return false
    }

    return false
  }

  const screens = [
    <Categories listenerType={listenerType} />,
    <FormUploadPhoto />,
    <FormGeneral />,
    <FormDescription />,
    <FormPrice 
      priceSettings={priceSettings}
      sellerSettings={sellerSettings}
      buyerSettings={buyerSettings}
    />,
    <FormDate />,
    <FormSummary />,
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

    // load fallback
    sellerContext.dispatch(Seller.updateOfferingData({
      ...inputFallback
    }))
    
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

    
    let error = true;
    error = validation(input.name, input.value)

    if(!error && error !== undefined) {
      input.parentElement.removeAttribute('data-error')
      if(input.value) sellerContext.dispatch(Seller.updateOfferingData({
        [input.name]: input.value
      }))
    } else {
      input.parentElement.setAttribute('data-error', error)
    }
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
      ...inputFallback
    }))

    // check for page
    localStorage.getItem('offeringProgress') &&
    sellerContext.dispatch(Seller.getOfferingProgress())

    triggerInit(init * -1)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <FormBottomNavigation 
          lastScreenBoolean={lastScreenBoolean}
          resetOfferingData={resetOfferingData}
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
        />
      </div>
    </section>
  )
}

export default NewOffer
