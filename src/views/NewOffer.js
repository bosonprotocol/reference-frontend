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

import { SellerContext, Seller } from "../contexts/Seller"
import { NavigationContext, Action } from "../contexts/Navigation"

import { NAME, CURRENCY, MODAL_TYPES, ROUTE } from "../helpers/Dictionary"
import { getAccountStoredInLocalStorage } from "../hooks/authenticate";
import { ModalContext, ModalResolver } from "../contexts/Modal";
import { useWeb3React } from "@web3-react/core";
import { checkForErrorsInNewOfferForm } from '../helpers/NewOfferFormValidator'

// switch with 'change', if you want to trigger on completed input, instead on each change
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

function NewOffer() {
  const screenController = useRef()
  const sellerContext = useContext(SellerContext)
  const navigationContext = useContext(NavigationContext)
  const [init, triggerInit] = useState(1)
  const activeScreen = sellerContext.state.offeringProgress
  const inScreenRange = (target) => (target >= 0 && target < screens.length)
  const history = useHistory()
  const modalContext = useContext(ModalContext);
  const [errorMessages, setErrorMessages] = useState({});
  const [lastInputChangeName, setLastInputChangeName] = useState(null);
  const inputFallback = {
    [NAME.PRICE_C]: CURRENCY.ETH,
    [NAME.SELLER_DEPOSIT_C]: CURRENCY.ETH,
    [NAME.DATE_START]: new Date(),
  }


  useEffect(() => {
    const getData = name => sellerContext.state.offeringData[name];

    if(lastInputChangeName) {
      const newErrorMessages = checkForErrorsInNewOfferForm(errorMessages, getData, lastInputChangeName);
      setErrorMessages(newErrorMessages)

    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[sellerContext.state.offeringData, lastInputChangeName]);
  
  useEffect(()=> {
    sellerContext.dispatch(Seller.resetOfferingData())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const createInputValueReceiver = (inputName) => (value) => {

    if(value || value === ''){
       
          if(!(inputName === NAME.IMAGE)) {
         sellerContext.dispatch(Seller.updateOfferingData({
           [inputName]: value
         }))
        } else {
          sellerContext.dispatch(Seller.updateOfferingData({
            [NAME.SELECTED_FILE]: value
          }))
          const fileReader = new FileReader();
          fileReader.addEventListener('load', (e) => {
               sellerContext.dispatch(Seller.updateOfferingData({[inputName]: e.currentTarget.result}));

          }); 
     
          fileReader.readAsDataURL(value)
        }
        setLastInputChangeName(inputName);
    } 
  }
  const screens = [
    <Categories inputValueReceiver={createInputValueReceiver(NAME.CATEGORY)} />,
    <FormUploadPhoto inputValueReceiver={createInputValueReceiver(NAME.IMAGE)}
    uploadImageErrorMessage={errorMessages[NAME.IMAGE]}/>,
    <FormGeneral titleValueReceiver={createInputValueReceiver(NAME.TITLE) }  
                 titleErrorMessage={errorMessages[NAME.TITLE]}
                 quantityValueReceiver={createInputValueReceiver(NAME.QUANTITY)}
                 quantityErrorMessage={errorMessages[NAME.QUANTITY]}
                 conditionValueReceiver={createInputValueReceiver(NAME.CONDITION)}
                  />,
    <FormDescription  
    descriptionValueReceiver={createInputValueReceiver(NAME.DESCRIPTION)}
    descriptionErrorMessage={errorMessages[NAME.DESCRIPTION]}
    />,
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
      
    

      priceErrorMessage={errorMessages[NAME.PRICE]}
      sellerDepositErrorMessage={errorMessages[NAME.SELLER_DEPOSIT]}
      buyerDepositErrorMessage={errorMessages[NAME.BUYER_DEPOSIT]}

    />,
    <FormDate 
      startDateValueReceiver={createInputValueReceiver(NAME.DATE_START)}
      startDateErrorMessage={errorMessages[NAME.DATE_START]}
      endDateValueReceiver={createInputValueReceiver(NAME.DATE_END)}
      endDateErrorMessage={errorMessages[NAME.DATE_END]}

     />,
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

  useEffect(()=> {
    navigationContext.dispatch(Action.setFormNavigation({
      screenController: screenController,
      lastScreenBoolean: lastScreenBoolean,
      activeScreen: activeScreen,
      setActiveScreen: setActiveScreen,
      errorMessages: errorMessages,
      screens: screens,
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenController, lastScreenBoolean, activeScreen, errorMessages])

  return (
    <section className="new-offer">
      <div className="container l flex column jc-sb">
        <div className="bind column">
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
      </div>
    </section>
  )
}

export default NewOffer
