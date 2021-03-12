const chai = require("chai");
const { expect } = chai;

const NewOfferFormValidator = require("../../../helpers/NewOfferFormValidator");
const ImageValidationConfig = require("../../../helpers/ImageValidationConfig");
const { NAME } = require("../../../helpers/Dictionary");

describe("NewOfferFormValidator - Image upload form validation", () => {
    it("Expect no validation error", async () => {
        const data = {
            [NAME.SELECTED_FILE]: {
                size: ImageValidationConfig.minimumFileSizeInKB,
                type: 'image/png'
            }
        };

        const existingErrors = [];
        const getData = name => data[name];

        const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(existingErrors, getData, null, null);
        const imageError = newErrors[NAME.IMAGE];

        expect(imageError).to.eql(null);
    });

    it("Expect validation error - file too large", async () => {
        const data = {
            [NAME.SELECTED_FILE]: {
                size: ImageValidationConfig.maximumFileSizeInMB + 1, // force failure
                type: 'image/png'
            }
        };

        const existingErrors = [];
        const getData = name => data[name];

        const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(existingErrors, getData, null, null);
        const imageError = newErrors[NAME.IMAGE];

        expect(imageError).to.eql(ImageValidationConfig.maxSizeExceededError);
    });

    it("Expect validation error - file too small", async () => {
        const data = {
            [NAME.SELECTED_FILE]: {
                size: ImageValidationConfig.minimumFileSizeInKB - 1, // force failure
                type: 'image/png'
            }
        };

        const existingErrors = [];
        const getData = name => data[name];

        const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(existingErrors, getData, null, null);
        const imageError = newErrors[NAME.IMAGE];

        expect(imageError).to.eql(ImageValidationConfig.minSizeExceededError);
    });

    it("Expect validation error - file type invalid", async () => {
        const data = {
            [NAME.SELECTED_FILE]: {
                size: ImageValidationConfig.minimumFileSizeInKB,
                type: 'text/html' // force failure
            }
        };

        const existingErrors = [];
        const getData = name => data[name];

        const newErrors = NewOfferFormValidator.checkForErrorsInNewOfferForm(existingErrors, getData, null, null);
        const imageError = newErrors[NAME.IMAGE];

        expect(imageError).to.eql(ImageValidationConfig.notAllowedMimeTypeError);
    });
});
