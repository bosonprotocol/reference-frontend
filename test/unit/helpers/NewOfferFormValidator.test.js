import { CURRENCY } from "../../../src/helpers/Dictionary";
import * as NewOfferFormValidator from "../../../src/helpers/NewOfferFormValidator";
import * as ValidationConfig from "../../../src/helpers/NewOfferFormValidationConfig";
import { NAME } from "../../../src/helpers/Dictionary";

describe("NewOfferFormValidator - Image upload form validation", () => {
  it("Expect no validation error", () => {
    const data = {
      [NAME.SELECTED_FILE]: {
        size: ValidationConfig.minimumFileSizeInKB,
        type: ValidationConfig.allowedMimeTypes[0],
      },
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const imageError = newErrors[NAME.IMAGE];

    expect(imageError).toEqual(null);
  });

  it("Expect validation error - file too large", () => {
    const data = {
      [NAME.SELECTED_FILE]: {
        size: ValidationConfig.maximumFileSizeInMB + 1, // force failure
        type: ValidationConfig.allowedMimeTypes[0],
      },
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const imageError = newErrors[NAME.IMAGE];

    expect(imageError).toEqual(ValidationConfig.maxSizeExceededError);
  });

  it("Expect validation error - file too small", () => {
    const data = {
      [NAME.SELECTED_FILE]: {
        size: ValidationConfig.minimumFileSizeInKB - 1, // force failure
        type: ValidationConfig.allowedMimeTypes[0],
      },
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const imageError = newErrors[NAME.IMAGE];

    expect(imageError).toEqual(ValidationConfig.minSizeExceededError);
  });

  it("Expect validation error - file type invalid", () => {
    const data = {
      [NAME.SELECTED_FILE]: {
        size: ValidationConfig.minimumFileSizeInKB,
        type: "text/html", // force failure
      },
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const imageError = newErrors[NAME.IMAGE];

    expect(imageError).toEqual(ValidationConfig.notAllowedMimeTypeError);
  });
});

describe("NewOfferFormValidator - Title validation", () => {
  it("Expect no validation error", () => {
    const data = {
      [NAME.TITLE]: "SAMPLE TITLE",
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const titleError = newErrors[NAME.TITLE];

    expect(titleError).toEqual(null);
  });

  it("Expect validation error - title too short", () => {
    const data = {
      [NAME.TITLE]: "T",
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const titleError = newErrors[NAME.TITLE];

    expect(titleError).toEqual(ValidationConfig.minTitleLengthError);
  });

  it("Expect validation error - title too long", () => {
    const data = {
      [NAME.TITLE]: "THIS IS AN EXTREMELY LONG EXAMPLE TITLE TO FAIL THE TEST",
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const titleError = newErrors[NAME.TITLE];

    expect(titleError).toEqual(ValidationConfig.maxTitleLengthError);
  });
});

describe("NewOfferFormValidator - Description validation", () => {
  it("Expect no validation error", () => {
    const data = {
      [NAME.DESCRIPTION]: "SAMPLE DESCRIPTIONS",
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const descriptionError = newErrors[NAME.DESCRIPTION];

    expect(descriptionError).toEqual(null);
  });

  it("Expect validation error - description too short", () => {
    const data = {
      [NAME.DESCRIPTION]: "D",
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const descriptionError = newErrors[NAME.DESCRIPTION];

    expect(descriptionError).toEqual(
      ValidationConfig.minDescriptionLengthError
    );
  });
});

describe("NewOfferFormValidator - Quantity validation", () => {
  it("Expect no validation error", () => {
    const data = {
      [NAME.QUANTITY]: 1,
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const quantityError = newErrors[NAME.QUANTITY];

    expect(quantityError).toEqual(null);
  });

  it("Expect validation error - quantity too low", () => {
    const data = {
      [NAME.QUANTITY]: -1,
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const quantityError = newErrors[NAME.QUANTITY];

    expect(quantityError).toEqual(ValidationConfig.minQuantityError);
  });

  it("Expect validation error - quantity too high", () => {
    const data = {
      [NAME.QUANTITY]: 11,
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const quantityError = newErrors[NAME.QUANTITY];

    expect(quantityError).toEqual(ValidationConfig.maxQuantityError);
  });

  it("Expect validation error - quantity is decimal", () => {
    const data = {
      [NAME.QUANTITY]: 1.1,
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      null
    );
    const quantityError = newErrors[NAME.QUANTITY];

    expect(quantityError).toEqual(ValidationConfig.noDecimalQuantityError);
  });
});

describe("NewOfferFormValidator - Price validation", () => {
  it("Expect no validation error", async () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: 1,
      [NAME.PRICE_C]: "ETH",
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      priceSettings
    );
    const priceError = newErrors[NAME.PRICE];

    expect(priceError).toEqual(null);
  });

  it("Expect validation error - price too low", () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: -0.1, //Todo check why fails on 0
      [NAME.PRICE_C]: "ETH",
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      priceSettings
    );
    const priceError = newErrors[NAME.PRICE];

    expect(priceError).toEqual(ValidationConfig.minPriceError);
  });
});

describe("NewOfferFormValidator - Seller deposit validation", () => {
  it("Expect no validation error", () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: 1,
      [NAME.PRICE_C]: "ETH",
      [NAME.SELLER_DEPOSIT]: 1,
      [NAME.DEPOSITS_C]: "ETH",
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      priceSettings
    );
    const sellerDepositError = newErrors[NAME.SELLER_DEPOSIT];

    expect(sellerDepositError).toEqual(null);
  });

  it("Expect validation error - seller deposit too low", () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: 1,
      [NAME.PRICE_C]: "ETH",
      [NAME.SELLER_DEPOSIT]: -0.1, // Todo check why 0 doesn't fail; must be below 0
      [NAME.DEPOSITS_C]: "ETH",
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      priceSettings
    );
    const sellerDepositError = newErrors[NAME.SELLER_DEPOSIT];

    expect(sellerDepositError).toEqual(ValidationConfig.minSellerDepositError);
  });
});

describe("NewOfferFormValidator - Buyer deposit validation", () => {
  it("Expect no validation error", () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: 1,
      [NAME.PRICE_C]: "ETH",
      [NAME.BUYER_DEPOSIT]: 1,
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      priceSettings
    );
    const buyerDepositError = newErrors[NAME.BUYER_DEPOSIT];

    expect(buyerDepositError).toEqual(null);
  });

  it("Expect validation error - buyer deposit too low", () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: 1,
      [NAME.PRICE_C]: "ETH",
      [NAME.BUYER_DEPOSIT]: -0.1, // Todo check why 0 doesn't fail; must be below 0
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      priceSettings
    );
    const buyerDepositError = newErrors[NAME.BUYER_DEPOSIT];

    expect(buyerDepositError).toEqual(ValidationConfig.minBuyerDepositError);
  });
});

describe("NewOfferFormValidator - Dates validation", () => {
  it("Expect no validation error", () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const startDate = new Date().setDate(new Date().getDate());
    const endDate = new Date().setDate(new Date().getDate() + 1);

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: 1,
      [NAME.PRICE_C]: "ETH",
      [NAME.BUYER_DEPOSIT]: 1,
      [NAME.DATE_START]: startDate,
      [NAME.DATE_END]: endDate,
    };

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      null,
      priceSettings
    );
    const startDateError = newErrors[NAME.DATE_START];
    const endDateError = newErrors[NAME.DATE_END];

    expect(startDateError).toEqual(null);
    expect(endDateError).toEqual(null);
  });

  it("Expect validation error - start date in past", () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const startDate = new Date().setDate(new Date().getDate() - 1); // force failure
    const endDate = new Date().setDate(new Date().getDate() + 1);

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: 1,
      [NAME.PRICE_C]: "ETH",
      [NAME.BUYER_DEPOSIT]: 1,
      [NAME.DATE_START]: startDate,
      [NAME.DATE_END]: endDate,
    };
    const lastInputChangeName = NAME.DATE_START;

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      lastInputChangeName,
      priceSettings
    );
    const startDateError = newErrors[NAME.DATE_START];
    const endDateError = newErrors[NAME.DATE_END];

    expect(startDateError).toEqual(ValidationConfig.startDateInPastError);
    expect(endDateError).toEqual(null);
  });

  it("Expect validation error - start date after expiry date", () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const startDate = new Date().setDate(new Date().getDate() + 2); // force failure
    const endDate = new Date().setDate(new Date().getDate() + 1);

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: 1,
      [NAME.PRICE_C]: "ETH",
      [NAME.BUYER_DEPOSIT]: 1,
      [NAME.DATE_START]: startDate,
      [NAME.DATE_END]: endDate,
    };
    const lastInputChangeName = NAME.DATE_START;

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      lastInputChangeName,
      priceSettings
    );
    const startDateError = newErrors[NAME.DATE_START];
    const endDateError = newErrors[NAME.DATE_END];

    expect(startDateError).toEqual(ValidationConfig.startDateAfterExpiryError);
    expect(endDateError).toEqual(null);
  });

  it("Expect validation error - expiry date before start date", () => {
    const priceSettings = {
      [CURRENCY.ETH]: {
        max: 0,
      },
      [CURRENCY.BSN]: {
        max: 0,
      },
    };

    const startDate = new Date().setDate(new Date().getDate() + 2); // force failure
    const endDate = new Date().setDate(new Date().getDate() + 1);

    const data = {
      [NAME.QUANTITY]: 1,
      [NAME.PRICE]: 1,
      [NAME.PRICE_C]: "ETH",
      [NAME.BUYER_DEPOSIT]: 1,
      [NAME.DATE_START]: startDate,
      [NAME.DATE_END]: endDate,
    };
    const lastInputChangeName = NAME.DATE_END;

    const existingErrors = [];
    const getData = (name) => data[name];

    const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(
      existingErrors,
      getData,
      lastInputChangeName,
      priceSettings
    );
    const startDateError = newErrors[NAME.DATE_START];
    const endDateError = newErrors[NAME.DATE_END];

    expect(startDateError).toEqual(null);
    expect(endDateError).toEqual(
      ValidationConfig.expiryDateBeforeStartDateError
    );
  });
});
