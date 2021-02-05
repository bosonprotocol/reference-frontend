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

import { NAME, CURRENCY, MODAL_TYPES, ROUTE } from "../helpers/Dictionary"

import { GetToday } from "../helpers/Misc"
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { ModalContext, ModalResolver } from "../contexts/Modal";
import { useWeb3React } from "@web3-react/core";

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
  const modalContext = useContext(ModalContext);
  const [errorMessages, setErrorMessages] = useState({});
  const inputFallback = {
    [NAME.PRICE_C]: CURRENCY.ETH,
    [NAME.SELLER_DEPOSIT_C]: CURRENCY.ETH,
    [NAME.DATE_START]: GetToday(),
  }

  const getData = name => sellerContext.state.offeringData[name]

  const priceCurrency = getData(NAME.PRICE_C)
  const sellerCurrency = getData(NAME.SELLER_DEPOSIT_C)

  Seller.resetOfferingData()
  const validation = (input, value) => {

    // price number inputs
    if(input === NAME.PRICE && getData(NAME.PRICE_C)) {
      if(isNaN(parseInt(value))) return 'Must be a valid number'
      if(value <= 0) return 'Value cannot be less or equal to 0'
      if(value > priceSettings[priceCurrency].max) return `The maximum value is ${priceSettings[priceCurrency].max}`

      return null
    }
    else if(input === NAME.SELLER_DEPOSIT && getData(NAME.SELLER_DEPOSIT_C)) {
      if(isNaN(parseInt(value))) return 'Must be a valid number'
      if(value <= 0) return 'Value cannot be less or equal to 0'
      if(value > sellerSettings[sellerCurrency].max) return `The maximum value is ${sellerSettings[sellerCurrency].max}`

      return null
    }
    else if(input === NAME.BUYER_DEPOSIT && getData(NAME.PRICE_C)) {
      if(isNaN(parseInt(value))) return 'Must be a valid number'
      if(value <= 0) return 'Value cannot be less or equal to 0'
      if(value > buyerSettings[priceCurrency].max) return `The maximum value is ${buyerSettings[priceCurrency].max}`

      return null
    }

    // description
    else if(input === NAME.DESCRIPTION) {
      if(value.length < descriptionSettings.min) return `Desciption must be at least ${descriptionSettings.min} characters`

      return null
    }

    // general
    else if(input === NAME.QUANTITY) {
      if(isNaN(parseInt(value))) return 'Must be a valid number'
      if(value <= 0) return 'Value cannot less or equal to 0'
      if(value > quantitySettings.max) return `Maximum quantity is ${quantitySettings.max}`

      return null
    }
    else if(input === NAME.TITLE) {
      console.log('in title', titleSettings)
      if(value.length <= titleSettings.min) return `Title must be at least ${titleSettings.min + 1} characters long`
      if(value.length > titleSettings.max) return `Title can't more than ${titleSettings.max} characters long`

      return null
    }

    return null
  }

  const createInputValueReceiver = (inputName) => (value) => {
    const errorMessage = validation(inputName, value);
    console.log(errorMessages)
    setErrorMessages((prev) => ({...prev, [inputName]: errorMessage}))
    if(value){
      sellerContext.dispatch(Seller.updateOfferingData({
        [inputName]: value
      }))
    } 
  }
  const screens = [
    <Categories inputValueReceiver={createInputValueReceiver(NAME.CATEGORY)} />,
    <FormUploadPhoto inputValueReceiver={createInputValueReceiver(NAME.SELECTED_FILE)}/>,
    <FormGeneral titleValueReceiver={createInputValueReceiver(NAME.TITLE) }  
                 titleErrorMessage={errorMessages[NAME.TITLE]}
                 quantityValueReceiver={createInputValueReceiver(NAME.QUANTITY)}
                 conditionValueReceiver={createInputValueReceiver(NAME.CONDITION)}
                  />,
    <FormDescription  descriptionValueReceiver={createInputValueReceiver(NAME.DESCRIPTION)}/>,
    <FormPrice
      priceSettings={priceSettings}
      sellerSettings={sellerSettings}
      buyerSettings={buyerSettings}
      priceValueReceiver={createInputValueReceiver(NAME.PRICE)}
      priceCurrencyReceiver={createInputValueReceiver(NAME.PRICE_C)}
      sellerDepositCurrencyValueReceiver={createInputValueReceiver(NAME.SELLER_DEPOSIT_C)}
      sellerDepositValueReceiver={createInputValueReceiver(NAME.SELLER_DEPOSIT)}
      buyerPriceSuffixValueReceiver={createInputValueReceiver(NAME.PRICE_SUFFIX)}
      buyerDepositValueReceiver={createInputValueReceiver(NAME.BUYER_DEPOSIT)}
    />,
    <FormDate 
      startDateValueReceiver={createInputValueReceiver(NAME.DATE_START)}
      endDateValueReceiver={createInputValueReceiver(NAME.DATE_END)}/>,
    <FormSummary />,
  ]

  const lastScreenBoolean = activeScreen === screens.length - 1

  const setActiveScreen = (target, backToHome) => {

    return backToHome ? history.goBack() :
    inScreenRange(target) && sellerContext.dispatch(Seller.setOfferingProgress(target))
  }

  const { account } = useWeb3React();

  // check for backup
  useEffect(() => {
    sellerContext.dispatch(Seller.updateOfferingData({
      ...inputFallback
    }))

    triggerInit(init * -1)

    const authData = getAccountStoredInLocalStorage(account);

    if (!authData.activeToken) {
      history.push(ROUTE.Home);

      modalContext.dispatch(ModalResolver.showModal({
        show: true,
        type: MODAL_TYPES.GENERIC_ERROR,
        content: 'Please check your wallet for Signature Request. Once authentication message is signed you can proceed'
      }));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                ><span></span></div>)}
            </div>
          </div>
          <div className="screen">
            <form id="offer-form">
              <div ref={screenController} className="screen-controller">
                {screens.map((screen, index) => {
                  return (
                    <div key={index} style={{ display: activeScreen === index ? "block" : "none" }}>{screen}</div>
                  )
                })}
              </div>
            </form>
          </div>
        </div>
        <FormBottomNavigation
          screenController={screenController}
          lastScreenBoolean={lastScreenBoolean}
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          errorMessages={errorMessages}
        />
      </div>
    </section>
  )
}

export default NewOffer
