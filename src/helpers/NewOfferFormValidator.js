import { ethers } from "ethers"
import { toFixed } from "../utils/format-utils"
import { NAME } from "./Dictionary"
import { profanityTest } from "./Profanity"
import * as ImageValidationConfig from "./ImageValidationConfig";

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

const checkForErrorsInNewOfferForm = (errorMessages, getData, lastInputChangeName, priceSettings) => {
  let newErrorMessages = { ...errorMessages };

  let quantityErrorMessage = null;
  const currentQuantityValue = getData(NAME.QUANTITY);

  if (currentQuantityValue) {
    if (isNaN(parseInt(currentQuantityValue))) {
      quantityErrorMessage = 'Must be a valid number'
    }
    if (currentQuantityValue <= 0) {
      quantityErrorMessage = 'Value cannot less or equal to 0'
    }
    if (currentQuantityValue > quantitySettings.max) {
      quantityErrorMessage = `Maximum quantity is ${quantitySettings.max}`
    }

    if (parseFloat(currentQuantityValue) !== parseInt(currentQuantityValue)) {
      quantityErrorMessage = `No decimal point allowed for quantity`
    }

    newErrorMessages = { ...newErrorMessages, [NAME.QUANTITY]: quantityErrorMessage }

  }

  let priceErrorMessage = null;
  const currentPriceValue = getData(NAME.PRICE);
  if (getData(NAME.PRICE_C) && currentPriceValue) {
    const priceCurrency = getData(NAME.PRICE_C)
    if (currentPriceValue.lte('0')) {
      priceErrorMessage = 'Value cannot be less or equal to 0'
    }
    if (currentQuantityValue && priceSettings[priceCurrency].max) {
      if (currentPriceValue.mul(currentQuantityValue).gt(priceSettings[priceCurrency].max)) {
        priceErrorMessage = `The maximum value is ${toFixed(+ethers.utils.formatEther(priceSettings[priceCurrency].max.div(currentQuantityValue)), 2)}`
      }
    }

    newErrorMessages = { ...newErrorMessages, [NAME.PRICE]: priceErrorMessage }
  }


  let sellerDepositErrorMessage = null;
  const currentSellerDepositValue = getData(NAME.SELLER_DEPOSIT);

  if (getData(NAME.SELLER_DEPOSIT_C) && currentSellerDepositValue) {
    const sellerCurrency = getData(NAME.SELLER_DEPOSIT_C)
    if (currentSellerDepositValue.lte('0')) {
      sellerDepositErrorMessage = 'Value cannot be less or equal to 0'
    }
    if (currentQuantityValue && priceSettings[sellerCurrency].max) {
      if (currentSellerDepositValue.mul(currentQuantityValue).gt(priceSettings[sellerCurrency].max)) {
        sellerDepositErrorMessage = `The maximum value is ${toFixed(+ethers.utils.formatEther(priceSettings[sellerCurrency].max.div(currentQuantityValue)), 2)}`
      }
    }


    newErrorMessages = { ...newErrorMessages, [NAME.SELLER_DEPOSIT]: sellerDepositErrorMessage }
  }

  let buyerDepositErrorMessage = null;
  const currentBuyerDepositValue = getData(NAME.BUYER_DEPOSIT);
  if (getData(NAME.PRICE_C) && currentBuyerDepositValue) {
    const priceCurrency = getData(NAME.PRICE_C)
    if (currentBuyerDepositValue.lte('0')) {
      buyerDepositErrorMessage = 'Value cannot be less or equal to 0'
    }
    if (currentQuantityValue && priceSettings[priceCurrency].max) {
      if (currentBuyerDepositValue.mul(currentQuantityValue).gt(priceSettings[priceCurrency].max)) {
        buyerDepositErrorMessage = `The maximum value is ${toFixed(+ethers.utils.formatEther(priceSettings[priceCurrency].max.div(currentQuantityValue)), 2)}`
      }
    }


    newErrorMessages = { ...newErrorMessages, [NAME.BUYER_DEPOSIT]: buyerDepositErrorMessage }
  }


  let descriptionErrorMessage = null;
  const currentDescriptionValue = getData(NAME.DESCRIPTION);
  if (currentDescriptionValue) {
    if (currentDescriptionValue.length < descriptionSettings.min) {
      descriptionErrorMessage = `Desciption must be at least ${descriptionSettings.min} characters`;
    }

    let profanityResult = profanityTest(currentDescriptionValue)
        
    if(profanityResult) descriptionErrorMessage = profanityResult

    newErrorMessages = { ...newErrorMessages, [NAME.DESCRIPTION]: descriptionErrorMessage }
  }






  let titleErrorMessage = null;
  const currentTitleValue = getData(NAME.TITLE);

  if (currentTitleValue) {
    if (currentTitleValue.length <= titleSettings.min) {
      titleErrorMessage = `Title must be at least ${titleSettings.min + 1} characters long`
    }
    if (currentTitleValue.length > titleSettings.max) {
      titleErrorMessage = `Title can't more than ${titleSettings.max} characters long`
    }

    let profanityResult = profanityTest(currentTitleValue)
        
    if(profanityResult) titleErrorMessage = profanityResult

    newErrorMessages = { ...newErrorMessages, [NAME.TITLE]: titleErrorMessage }

  }
  let imageErrorMessage = null;
  const currentImageValue = getData(NAME.SELECTED_FILE);

  if (currentImageValue) {
    // If file is too small
    if (currentImageValue.size < ImageValidationConfig.minimumFileSizeInKB) {
      imageErrorMessage = ImageValidationConfig.minSizeExceededError
    }

    // If file is too large
    if (currentImageValue.size > ImageValidationConfig.maximumFileSizeInMB) {
      imageErrorMessage = ImageValidationConfig.maxSizeExceededError
    }

    // If file is invalid type
    if (!ImageValidationConfig.allowedMimeTypes.includes(currentImageValue.type)) {
      imageErrorMessage = ImageValidationConfig.notAllowedMimeTypeError
    }

    newErrorMessages = { ...newErrorMessages, [NAME.IMAGE]: imageErrorMessage }
  }

  let dateStartErrorMessage = null;
  const currentDateStartValue = getData(NAME.DATE_START);

  let dateEndErrorMessage = null;
  const currentDateEndValue = getData(NAME.DATE_END);

  if (currentDateStartValue && lastInputChangeName === NAME.DATE_START) {


    const yesterday = new Date().setDate(new Date().getDate() - 1);
    dateStartErrorMessage = new Date(currentDateStartValue).getTime() <= yesterday ? "Start Date can't be set before Today" :
      new Date(currentDateStartValue).getTime() >= new Date(currentDateEndValue).getTime() ? "Start Date can't be set after the Expiry Date" :
        null;

  }
  if (currentDateEndValue && lastInputChangeName === NAME.DATE_END) {
    dateEndErrorMessage = new Date(currentDateEndValue).getTime() <= new Date(currentDateStartValue).getTime() ?
      "Expiry Date can't be set before Start Date." : null;

  }
  return { ...newErrorMessages, [NAME.DATE_END]: dateEndErrorMessage, [NAME.DATE_START]: dateStartErrorMessage };
}

export { checkForErrorsInNewOfferForm }