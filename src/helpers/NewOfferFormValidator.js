import { NAME, CURRENCY } from "./Dictionary"
import { ListOfBadWords, latinise } from "./Profanity"

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

const profanityTest = (inputRaw) => {
  // merge the input into single string of letters and numbers only
  let input = inputRaw.split(/[^a-zA-Z0-9]+/).join('-').toLowerCase()

  // convert special characters to latin
  input = latinise(input)

  // create regex with list of bad words
  let badWordsRegex = ListOfBadWords.join('-|-')

  // check for bad words
  let profanityResult = input.match(badWordsRegex)

  return profanityResult ? 'Profanity is not allowed' : false
}

const checkForErrorsInNewOfferForm = (errorMessages, getData, lastInputChangeName) => {
    let newErrorMessages = {...errorMessages};

    let priceErrorMessage = null;
    const currentPriceValue = getData(NAME.PRICE);
    if(getData(NAME.PRICE_C) && currentPriceValue) {
        const priceCurrency = getData(NAME.PRICE_C)
     
      if(isNaN(parseInt(currentPriceValue))) {
        priceErrorMessage = 'Must be a valid number';
      } 
      if(currentPriceValue <= 0) {
        priceErrorMessage = 'Value cannot be less or equal to 0';
      } 
      if(currentPriceValue > priceSettings[priceCurrency].max) {
        priceErrorMessage =`The maximum value is ${priceSettings[priceCurrency].max}`
      } 
      newErrorMessages = {...newErrorMessages, [NAME.PRICE]: priceErrorMessage} 
    }


    let sellerDepositErrorMessage = null;
    const currentSellerDepositValue = getData(NAME.SELLER_DEPOSIT);

    if(getData(NAME.SELLER_DEPOSIT_C) && currentSellerDepositValue) {
        const sellerCurrency = getData(NAME.SELLER_DEPOSIT_C)

      if(isNaN(parseInt(currentSellerDepositValue))) {
        sellerDepositErrorMessage = 'Must be a valid number'
      } 
      if(currentSellerDepositValue <= 0) {
        sellerDepositErrorMessage = 'Value cannot be less or equal to 0'
      } 
      if(currentSellerDepositValue > sellerSettings[sellerCurrency].max) {
        sellerDepositErrorMessage = `The maximum value is ${sellerSettings[sellerCurrency].max}`
      } 

      newErrorMessages = {...newErrorMessages, [NAME.SELLER_DEPOSIT]: sellerDepositErrorMessage} 
    }

    let buyerDepositErrorMessage = null;
    const currentBuyerDepositValue = getData(NAME.BUYER_DEPOSIT);
    if(getData(NAME.PRICE_C) && currentBuyerDepositValue) {
        const priceCurrency = getData(NAME.PRICE_C)


      if(isNaN(parseInt(currentBuyerDepositValue))) {
        buyerDepositErrorMessage = 'Must be a valid number'
      } 
      if(currentBuyerDepositValue <= 0) {
        buyerDepositErrorMessage = 'Value cannot be less or equal to 0'
      } 
      if(currentBuyerDepositValue > buyerSettings[priceCurrency].max) {
        buyerDepositErrorMessage = `The maximum value is ${buyerSettings[priceCurrency].max}`
      } 

      newErrorMessages = {...newErrorMessages, [NAME.BUYER_DEPOSIT]: buyerDepositErrorMessage} 
    }


      let descriptionErrorMessage = null;
      const currentDescriptionValue = getData(NAME.DESCRIPTION);
      if(currentDescriptionValue) {
        if(currentDescriptionValue.length < descriptionSettings.min) {
          descriptionErrorMessage = `Desciption must be at least ${descriptionSettings.min} characters`;
        }

        let profanityResult = profanityTest(currentDescriptionValue)
        
        if(profanityResult) descriptionErrorMessage = profanityResult

        newErrorMessages = {...newErrorMessages, [NAME.DESCRIPTION]: descriptionErrorMessage} 
      }
    
      


      let quantityErrorMessage = null;
      const currentQuantityValue = getData(NAME.QUANTITY);
      
    if(currentQuantityValue) {
      if(isNaN(parseInt(currentQuantityValue))) {
        quantityErrorMessage = 'Must be a valid number'
      } 
      if(currentQuantityValue <= 0) {
        quantityErrorMessage = 'Value cannot less or equal to 0'
      } 
      if(currentQuantityValue > quantitySettings.max) {
        quantityErrorMessage = `Maximum quantity is ${quantitySettings.max}`
      } 
      console.log(currentQuantityValue, parseInt(currentQuantityValue))
      if(parseFloat(currentQuantityValue) !== parseInt(currentQuantityValue)) {
        quantityErrorMessage = `No decimal point allowed for quantity`
      }

      newErrorMessages = {...newErrorMessages, [NAME.QUANTITY]: quantityErrorMessage} 

    }

    let titleErrorMessage = null;
    const currentTitleValue = getData(NAME.TITLE);

    if(currentTitleValue) {
      if(currentTitleValue.length <= titleSettings.min) {
        titleErrorMessage =  `Title must be at least ${titleSettings.min + 1} characters long`
      }
      if(currentTitleValue.length > titleSettings.max) {
        titleErrorMessage = `Title can't more than ${titleSettings.max} characters long`
      }

      let profanityResult = profanityTest(currentTitleValue)

      if(profanityResult) titleErrorMessage = profanityResult

      newErrorMessages = {...newErrorMessages, [NAME.TITLE]: titleErrorMessage} 

    } 
    let imageErrorMessage = null;
    const currentImageValue = getData(NAME.SELECTED_FILE);

    if (currentImageValue) {
      const maxSize =  ( 3 ) * (1000 * 1000) // in mb
      const acceptedImageFormats = ['image/jpeg', 'image/png']
      const rules = {
        size: currentImageValue.size > maxSize,
        type: !acceptedImageFormats.includes(currentImageValue.type) && currentImageValue.type !== undefined,
        existing: !currentImageValue.name
      }
      imageErrorMessage = rules.type ? `This file type is not allowed.` :
      rules.size ? `Image is too large! Maximum file size is ${maxSize / (1000 * 1000)}mb` :
      null;
            newErrorMessages = {...newErrorMessages, [NAME.IMAGE]: imageErrorMessage} 

    } 

    let dateStartErrorMessage = null;
    const currentDateStartValue = getData(NAME.DATE_START);

    let dateEndErrorMessage = null;
    const currentDateEndValue = getData(NAME.DATE_END);

     if (currentDateStartValue  && lastInputChangeName === NAME.DATE_START) {
  
      
      const yesterday = new Date().setDate(new Date().getDate() - 1);
      dateStartErrorMessage =  new Date(currentDateStartValue).getTime() <= yesterday ? "Start Date can't be set before Today" :
        new Date(currentDateStartValue).getTime() >= new Date(currentDateEndValue).getTime() ? "Start Date can't be set after the Expiry Date" :
        null;

    }
    if(currentDateEndValue && lastInputChangeName === NAME.DATE_END) {
      dateEndErrorMessage =  new Date(currentDateEndValue).getTime() <= new Date(currentDateStartValue).getTime() ?
        "Expiry Date can't be set before Start Date." : null;

    }
    return {...newErrorMessages, [NAME.DATE_END]: dateEndErrorMessage, [NAME.DATE_START]: dateStartErrorMessage};
  }

  export {checkForErrorsInNewOfferForm}