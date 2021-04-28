// START IMAGE CONFIG
export const minimumFileSizeInKB = 10 * 1024; // in KB - 10KB
export const maximumFileSizeInMB = 5 * (1024 * 1024); // in MB - 5MB

export const allowedMimeTypes = ["image/jpeg", "image/png"];
export const acceptedImageExtensions = allowedMimeTypes.map(
  (mimeType) => mimeType.split("/")[1]
); // extract image extensions from mime-types

export const maxSizeExceededError = `Image is too large! Maximum file size is ${
  maximumFileSizeInMB / (1024 * 1024)
}MB.`;
export const minSizeExceededError = `Image is too small! Minimum file size is ${
  minimumFileSizeInKB / 1024
}KB.`;
export const notAllowedMimeTypeError = `This file type is not allowed. Must be one of: ${acceptedImageExtensions}.`;
// END IMAGE CONFIG

const maxLengthError = (field, max) =>
  `${field} can't be more than ${max} characters long`;
const minLengthError = (field, min) =>
  `${field} must be at least ${min} characters long`;

// START TITLE CONFIG
export const titleSettings = {
  min: 4,
  max: 50,
};
export const minTitleLengthError = minLengthError("Title", titleSettings.min);
export const maxTitleLengthError = maxLengthError("Title", titleSettings.max);
// END TITLE CONFIG

// START DESCRIPTION CONFIG
export const descriptionSettings = {
  min: 10,
};
export const minDescriptionLengthError = `Description must be at least ${descriptionSettings.min} characters`;
// END DESCRIPTION CONFIG

// START QUANTITY CONFIG
export const quantitySettings = {
  max: 10,
  min: 1,
};
export const invalidQuantityError = "Must be a valid number";
export const minQuantityError = "Value must be greater than 0";
export const maxQuantityError = `Maximum quantity is ${quantitySettings.max}`;
export const noDecimalQuantityError = `No decimal point allowed for quantity`;
// END QUANTITY CONFIG

// START PRICE CONFIG
export const minPriceError = "Value must be greater than 0";
// END PRICE CONFIG

// START SELLER DEPOSIT CONFIG
export const minSellerDepositError = "Value must be greater than 0";
// END SELLER DEPOSIT CONFIG

// START BUYER DEPOSIT CONFIG
export const minBuyerDepositError = "Value must be greater than 0";
// END BUYER DEPOSIT CONFIG

// START DATES CONFIG
export const startDateInPastError = "Start Date can't be set in the past.";
export const startDateAfterExpiryError =
  "Start Date can't be set after the Expiry Date.";
export const expiryDateBeforeStartDateError =
  "Expiry Date can't be set before Start Date.";
// END DATES CONFIG

// LOCATION CONFIG

// ADDRESS LINE CONFIG
export const addressLineSettings = {
  min: 4,
  max: 20,
};

export const minAddressLengthError = minLengthError(
  "Address",
  addressLineSettings.min
);
export const maxAddressLengthError = maxLengthError(
  "Address",
  addressLineSettings.max
);
// END ADDRESS LINE CONFIG

// POSTCODE CONFIG
export const postcodeSettings = {
  min: 4,
  max: 10,
};
export const minPostcodeLengthError = minLengthError(
  "Postcode",
  postcodeSettings.min
);
export const maxPostcodeLengthError = maxLengthError(
  "Postcode",
  postcodeSettings.max
);
// END POSTCODE CONFIG
