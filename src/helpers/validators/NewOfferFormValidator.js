import { ethers } from "ethers";
import { toFixed } from "../../utils/FormatUtils";
import { NAME } from "../configs/Dictionary";
import { profanityCheck } from "../../utils/Profanity";
import * as ValidationConfig from "../configs/NewOfferFormValidatorConfig";

const checkForErrorsInNewOfferForm = (
  errorMessages,
  getData,
  lastInputChangeName,
  priceSettings
) => {
  let newErrorMessages = { ...errorMessages };

  newErrorMessages = imageValidation(newErrorMessages, getData);
  newErrorMessages = titleValidation(newErrorMessages, getData);
  newErrorMessages = descriptionValidation(newErrorMessages, getData);

  const quantityValidationCheck = quantityValidation(newErrorMessages, getData);
  newErrorMessages = quantityValidationCheck[0];
  const currentQuantityValue = quantityValidationCheck[1];

  newErrorMessages = priceValidation(
    newErrorMessages,
    getData,
    priceSettings,
    currentQuantityValue
  );
  newErrorMessages = sellerDepositValidation(
    newErrorMessages,
    getData,
    priceSettings,
    currentQuantityValue
  );
  newErrorMessages = buyerDepositValidation(
    newErrorMessages,
    getData,
    priceSettings,
    currentQuantityValue
  );
  newErrorMessages = datesValidation(
    newErrorMessages,
    getData,
    lastInputChangeName
  );

  newErrorMessages = addressLineOneValidation(
    newErrorMessages,
    getData,
    lastInputChangeName
  );

  newErrorMessages = addressLineTwoValidation(
    newErrorMessages,
    getData,
    lastInputChangeName
  );

  newErrorMessages = postCodeValidation(
    newErrorMessages,
    getData,
    lastInputChangeName
  );

  return newErrorMessages;
};

const imageValidation = (errorMessages, getData) => {
  let imageErrorMessage = null;
  const currentImageValue = getData(NAME.SELECTED_FILE);

  if (currentImageValue) {
    if (currentImageValue.size < ValidationConfig.minimumFileSizeInKB) {
      imageErrorMessage = ValidationConfig.minSizeExceededError;
    }

    if (currentImageValue.size > ValidationConfig.maximumFileSizeInMB) {
      imageErrorMessage = ValidationConfig.maxSizeExceededError;
    }

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
    if (currentTitleValue.length < ValidationConfig.titleSettings.min) {
      titleErrorMessage = ValidationConfig.minTitleLengthError;
    }

    if (currentTitleValue.length > ValidationConfig.titleSettings.max) {
      titleErrorMessage = ValidationConfig.maxTitleLengthError;
    }

    let profanityResult = profanityCheck(currentTitleValue);

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
    if (
      currentDescriptionValue.length < ValidationConfig.descriptionSettings.min
    ) {
      descriptionErrorMessage = ValidationConfig.minDescriptionLengthError;
    }

    let profanityResult = profanityCheck(currentDescriptionValue);

    if (profanityResult) {
      descriptionErrorMessage = profanityResult;
    }

    errorMessages = {
      ...errorMessages,
      [NAME.DESCRIPTION]: descriptionErrorMessage,
    };
  }

  return errorMessages;
};

const addressLineOneValidation = (errorMessages, getData) => {
  let addressLineOneErrorMessage = null;
  const currentAddressLineOneValue = getData(NAME.ADDRESS_LINE_ONE);

  if (currentAddressLineOneValue) {
    if (
      currentAddressLineOneValue.length <
      ValidationConfig.addressLineSettings.min
    ) {
      addressLineOneErrorMessage = ValidationConfig.minAddressLengthError;
    }

    if (
      currentAddressLineOneValue.length >
      ValidationConfig.addressLineSettings.max
    ) {
      addressLineOneErrorMessage = ValidationConfig.maxAddressLengthError;
    }

    let profanityResult = profanityCheck(currentAddressLineOneValue);

    if (profanityResult) {
      addressLineOneErrorMessage = profanityResult;
    }

    errorMessages = {
      ...errorMessages,
      [NAME.ADDRESS_LINE_ONE]: addressLineOneErrorMessage,
    };
  }
  return errorMessages;
};

const addressLineTwoValidation = (errorMessages, getData) => {
  let addressLineTwoErrorMessage = null;
  const currentAddressLineTwoValue = getData(NAME.ADDRESS_LINE_TWO);

  if (currentAddressLineTwoValue) {
    if (
      currentAddressLineTwoValue.length <
      ValidationConfig.addressLineSettings.min
    ) {
      addressLineTwoErrorMessage = ValidationConfig.minAddressLengthError;
    }

    if (
      currentAddressLineTwoValue.length >
      ValidationConfig.addressLineSettings.max
    ) {
      addressLineTwoErrorMessage = ValidationConfig.maxAddressLengthError;
    }

    let profanityResult = profanityCheck(currentAddressLineTwoValue);

    if (profanityResult) {
      addressLineTwoErrorMessage = profanityResult;
    }

    errorMessages = {
      ...errorMessages,
      [NAME.ADDRESS_LINE_TWO]: addressLineTwoErrorMessage,
    };
  }

  return errorMessages;
};

const postCodeValidation = (errorMessages, getData) => {
  let postcodeErrorMessage = null;
  const currentPostcodeValue = getData(NAME.POSTCODE);

  if (currentPostcodeValue) {
    if (currentPostcodeValue.length < ValidationConfig.postcodeSettings.min) {
      postcodeErrorMessage = ValidationConfig.minPostcodeLengthError;
    }

    if (currentPostcodeValue.length > ValidationConfig.postcodeSettings.max) {
      postcodeErrorMessage = ValidationConfig.maxPostcodeLengthError;
    }

    let profanityResult = profanityCheck(currentPostcodeValue);

    if (profanityResult) {
      postcodeErrorMessage = profanityResult;
    }

    errorMessages = { ...errorMessages, [NAME.POSTCODE]: postcodeErrorMessage };
  }

  return errorMessages;
};

const quantityValidation = (errorMessages, getData) => {
  let quantityErrorMessage = null;
  const currentQuantityValue = getData(NAME.QUANTITY);

  if (currentQuantityValue === "") {
    quantityErrorMessage = null;
  }

  if (currentQuantityValue || currentQuantityValue === 0) {
    if (isNaN(parseInt(currentQuantityValue))) {
      quantityErrorMessage = ValidationConfig.invalidQuantityError;
    }

    if (currentQuantityValue < ValidationConfig.quantitySettings.min) {
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

  return [errorMessages, currentQuantityValue];
};

const priceValidation = (
  errorMessages,
  getData,
  priceSettings,
  currentQuantityValue
) => {
  let priceErrorMessage = null;
  const currentPriceValue = getData(NAME.PRICE);

  if (getData(NAME.PRICE_C) && currentPriceValue) {
    const priceCurrency = getData(NAME.PRICE_C);

    if (currentPriceValue <= 0) {
      priceErrorMessage = ValidationConfig.minPriceError;
    }

    if (currentQuantityValue && priceSettings[priceCurrency].max) {
      if (
        currentPriceValue
          .mul(currentQuantityValue)
          .gt(priceSettings[priceCurrency].max)
      ) {
        priceErrorMessage = `The maximum value is ${toFixed(
          +ethers.utils.formatEther(
            priceSettings[priceCurrency].max.div(currentQuantityValue)
          ),
          2
        )}`;
      }
    }

    errorMessages = { ...errorMessages, [NAME.PRICE]: priceErrorMessage };
  }

  return errorMessages;
};

const sellerDepositValidation = (
  errorMessages,
  getData,
  priceSettings,
  currentQuantityValue
) => {
  let sellerDepositErrorMessage = null;
  const currentSellerDepositValue = getData(NAME.SELLER_DEPOSIT);
  const currentSellerDepositCurrency = getData(NAME.DEPOSITS_C);

  if (currentSellerDepositCurrency && currentSellerDepositValue) {
    if (currentSellerDepositValue <= 0) {
      sellerDepositErrorMessage = ValidationConfig.minSellerDepositError;
    }

    if (
      currentQuantityValue &&
      priceSettings[currentSellerDepositCurrency].max
    ) {
      if (
        currentSellerDepositValue
          .mul(currentQuantityValue)
          .gt(priceSettings[currentSellerDepositCurrency].max)
      ) {
        sellerDepositErrorMessage = `The maximum value is ${toFixed(
          +ethers.utils.formatEther(
            priceSettings[currentSellerDepositCurrency].max.div(
              currentQuantityValue
            )
          ),
          2
        )}`;
      }
    }

    errorMessages = {
      ...errorMessages,
      [NAME.SELLER_DEPOSIT]: sellerDepositErrorMessage,
    };
  }

  return errorMessages;
};

const buyerDepositValidation = (
  errorMessages,
  getData,
  priceSettings,
  currentQuantityValue
) => {
  let buyerDepositErrorMessage = null;
  const currentBuyerDepositValue = getData(NAME.BUYER_DEPOSIT);

  if (getData(NAME.PRICE_C) && currentBuyerDepositValue) {
    const priceCurrency = getData(NAME.PRICE_C);

    if (currentBuyerDepositValue <= 0) {
      buyerDepositErrorMessage = ValidationConfig.minBuyerDepositError;
    }

    if (currentQuantityValue && priceSettings[priceCurrency].max) {
      if (
        currentBuyerDepositValue
          .mul(currentQuantityValue)
          .gt(priceSettings[priceCurrency].max)
      ) {
        buyerDepositErrorMessage = `The maximum value is ${toFixed(
          +ethers.utils.formatEther(
            priceSettings[priceCurrency].max.div(currentQuantityValue)
          ),
          2
        )}`;
      }
    }

    errorMessages = {
      ...errorMessages,
      [NAME.BUYER_DEPOSIT]: buyerDepositErrorMessage,
    };
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
    dateStartErrorMessage =
      new Date(currentDateStartValue).getTime() <= yesterday
        ? ValidationConfig.startDateInPastError
        : new Date(currentDateStartValue).getTime() >=
          new Date(currentDateEndValue).getTime()
        ? ValidationConfig.startDateAfterExpiryError
        : null;
  }

  if (currentDateEndValue && lastInputChangeName === NAME.DATE_END) {
    dateEndErrorMessage =
      new Date(currentDateEndValue).getTime() <=
      new Date(currentDateStartValue).getTime()
        ? ValidationConfig.expiryDateBeforeStartDateError
        : null;
  }

  return {
    ...errorMessages,
    [NAME.DATE_END]: dateEndErrorMessage,
    [NAME.DATE_START]: dateStartErrorMessage,
  };
};

export { checkForErrorsInNewOfferForm };
