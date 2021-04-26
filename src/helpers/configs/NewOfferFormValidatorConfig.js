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

// START TITLE CONFIG
export const titleSettings = {
  min: 4,
  max: 50,
};
export const minTitleLengthError = `Title must be at least ${titleSettings.min} characters long`;
export const maxTitleLengthError = `Title can't more than ${titleSettings.max} characters long`;
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
  "Start Date must be before Expiry Date.";
export const expiryDateBeforeStartDateError =
  "Expiry Date must be after Start Date.";
// END DATES CONFIG
