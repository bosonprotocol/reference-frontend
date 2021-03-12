import { ethers } from "ethers"
import { toFixed } from "../utils/format-utils"
import { NAME } from "./Dictionary"
import { profanityTest } from "./Profanity"
import * as ValidationConfig from "./NewOfferFormValidationConfig";

const checkForErrorsInNewOfferForm = (errorMessages, getData, lastInputChangeName, priceSettings) => {
  let newErrorMessages = { ...errorMessages };

  // IMAGE VALIDATION
  newErrorMessages = imageValidation(newErrorMessages, getData);

  // TITLE VALIDATION
  newErrorMessages = titleValidation(newErrorMessages, getData);

  // DESCRIPTION VALIDATION
  newErrorMessages = descriptionValidation(newErrorMessages, getData);

  // QUANTITY VALIDATION
  const quantityValidationCheck = quantityValidation(newErrorMessages, getData);
  newErrorMessages = quantityValidationCheck[0];
  const currentQuantityValue = quantityValidationCheck[1];

  // PRICE VALIDATION
  newErrorMessages = priceValidation(newErrorMessages, getData, priceSettings, currentQuantityValue);

  // SELLER DEPOSIT VALIDATION
  newErrorMessages = sellerDepositValidation(newErrorMessages, getData, priceSettings, currentQuantityValue);

  // BUYER DEPOSIT VALIDATION
  newErrorMessages = buyerDepositValidation(newErrorMessages, getData, priceSettings, currentQuantityValue);

  // DATES VALIDATION
  newErrorMessages = datesValidation(newErrorMessages, getData, lastInputChangeName);

  return newErrorMessages;
}

const imageValidation = (errorMessages, getData) => {
  let imageErrorMessage = null;
  const currentImageValue = getData(NAME.SELECTED_FILE);

  if (currentImageValue) {
    // If file is too small
    if (currentImageValue.size < ValidationConfig.minimumFileSizeInKB) {
      imageErrorMessage = ValidationConfig.minSizeExceededError;
    }

    // If file is too large
    if (currentImageValue.size > ValidationConfig.maximumFileSizeInMB) {
      imageErrorMessage = ValidationConfig.maxSizeExceededError;
    }

    // If file is invalid type
    if (!ValidationConfig.allowedMimeTypes.includes(currentImageValue.type)) {
      imageErrorMessage = ValidationConfig.notAllowedMimeTypeError;
    }

    errorMessages = { ...errorMessages, [NAME.IMAGE]: imageErrorMessage };
  }

  return errorMessages;
};

const titleValidation = (errorMessages, getData) => {
  let titleErrorMessage = null;
  const currentTitleValue = getData(NAME.TITLE);

  if (currentTitleValue) {
    if (currentTitleValue.length <= ValidationConfig.titleSettings.min) {
      titleErrorMessage = ValidationConfig.minTitleLengthError;
    }

    if (currentTitleValue.length > ValidationConfig.titleSettings.max) {
      titleErrorMessage = ValidationConfig.maxTitleLengthError;
    }

    let profanityResult = profanityTest(currentTitleValue);

    if (profanityResult) {
      titleErrorMessage = profanityResult;
    }

    errorMessages = { ...errorMessages, [NAME.TITLE]: titleErrorMessage };
  }

  return errorMessages;
};

const descriptionValidation = (errorMessages, getData) => {
  let descriptionErrorMessage = null;
  const currentDescriptionValue = getData(NAME.DESCRIPTION);

  if (currentDescriptionValue) {
    if (currentDescriptionValue.length < ValidationConfig.descriptionSettings.min) {
      descriptionErrorMessage = ValidationConfig.minDescriptionLengthError;
    }

    let profanityResult = profanityTest(currentDescriptionValue);

    if (profanityResult) {
      descriptionErrorMessage = profanityResult;
    }

    errorMessages = { ...errorMessages, [NAME.DESCRIPTION]: descriptionErrorMessage }
  }

  return errorMessages;
};

const quantityValidation = (errorMessages, getData) => {
  let quantityErrorMessage = null;
  const currentQuantityValue = getData(NAME.QUANTITY);

  if (currentQuantityValue) {
    if (isNaN(parseInt(currentQuantityValue))) {
      quantityErrorMessage = ValidationConfig.invalidQuantityError;
    }

    if (currentQuantityValue <= 0) {
      quantityErrorMessage = ValidationConfig.minQuantityError;
    }

    if (currentQuantityValue > ValidationConfig.quantitySettings.max) {
      quantityErrorMessage = ValidationConfig.maxQuantityError;
    }

    if (parseFloat(currentQuantityValue) !== parseInt(currentQuantityValue)) {
      quantityErrorMessage = ValidationConfig.noDecimalQuantityError;
    }

    errorMessages = { ...errorMessages, [NAME.QUANTITY]: quantityErrorMessage };
  }

  return [{ ...errorMessages }, currentQuantityValue];
};

const priceValidation = (errorMessages, getData, priceSettings, currentQuantityValue) => {
  let priceErrorMessage = null;
  const currentPriceValue = getData(NAME.PRICE);

  if (getData(NAME.PRICE_C) && currentPriceValue) {
    const priceCurrency = getData(NAME.PRICE_C);

    if (currentPriceValue <= 0) {
      priceErrorMessage = ValidationConfig.minPriceError;
    }

    if (currentQuantityValue && priceSettings[priceCurrency].max) {
      if (currentPriceValue.mul(currentQuantityValue) > (priceSettings[priceCurrency].max)) {
        priceErrorMessage = `The maximum value is ${toFixed(+ethers.utils.formatEther(priceSettings[priceCurrency].max.div(currentQuantityValue)), 2)}`;
      }
    }

    errorMessages = { ...errorMessages, [NAME.PRICE]: priceErrorMessage };
  }

  return errorMessages;
};

const sellerDepositValidation = (errorMessages, getData, priceSettings, currentQuantityValue) => {
  let sellerDepositErrorMessage = null;
  const currentSellerDepositValue = getData(NAME.SELLER_DEPOSIT);

  if (getData(NAME.SELLER_DEPOSIT_C) && currentSellerDepositValue) {
    const sellerCurrency = getData(NAME.SELLER_DEPOSIT_C);

    if (currentSellerDepositValue <= 0) {
      sellerDepositErrorMessage = 'Value cannot be less or equal to 0';
    }

    if (currentQuantityValue && priceSettings[sellerCurrency].max) {
      if (currentSellerDepositValue.mul(currentQuantityValue) > (priceSettings[sellerCurrency].max)) {
        sellerDepositErrorMessage = `The maximum value is ${toFixed(+ethers.utils.formatEther(priceSettings[sellerCurrency].max.div(currentQuantityValue)), 2)}`;
      }
    }

    errorMessages = { ...errorMessages, [NAME.SELLER_DEPOSIT]: sellerDepositErrorMessage };
  }

  return errorMessages;
};

const buyerDepositValidation = (errorMessages, getData, priceSettings, currentQuantityValue) => {
  let buyerDepositErrorMessage = null;
  const currentBuyerDepositValue = getData(NAME.BUYER_DEPOSIT);

  if (getData(NAME.PRICE_C) && currentBuyerDepositValue) {
    const priceCurrency = getData(NAME.PRICE_C);

    if (currentBuyerDepositValue <= 0) {
      buyerDepositErrorMessage = 'Value cannot be less or equal to 0';
    }

    if (currentQuantityValue && priceSettings[priceCurrency].max) {
      if (currentBuyerDepositValue.mul(currentQuantityValue) > (priceSettings[priceCurrency].max)) {
        buyerDepositErrorMessage = `The maximum value is ${toFixed(+ethers.utils.formatEther(priceSettings[priceCurrency].max.div(currentQuantityValue)), 2)}`;
      }
    }

    errorMessages = { ...errorMessages, [NAME.BUYER_DEPOSIT]: buyerDepositErrorMessage };
  }

  return errorMessages;
};

const datesValidation = (errorMessages, getData, lastInputChangeName) => {
  let dateStartErrorMessage = null;
  const currentDateStartValue = getData(NAME.DATE_START);

  let dateEndErrorMessage = null;
  const currentDateEndValue = getData(NAME.DATE_END);

  if (currentDateStartValue && lastInputChangeName === NAME.DATE_START) {
    const yesterday = new Date().setDate(new Date().getDate() - 1);
    dateStartErrorMessage = new Date(currentDateStartValue).getTime() <= yesterday ? ValidationConfig.startDateInPastError :
        new Date(currentDateStartValue).getTime() >= new Date(currentDateEndValue).getTime() ? ValidationConfig.startDateAfterExpiryError :
            null;
  }

  if (currentDateEndValue && lastInputChangeName === NAME.DATE_END) {
    dateEndErrorMessage = new Date(currentDateEndValue).getTime() <= new Date(currentDateStartValue).getTime() ?
        ValidationConfig.expiryDateBeforeStartDateError : null;
  }

  return { ...errorMessages, [NAME.DATE_END]: dateEndErrorMessage, [NAME.DATE_START]: dateStartErrorMessage };
};

export { checkForErrorsInNewOfferForm }