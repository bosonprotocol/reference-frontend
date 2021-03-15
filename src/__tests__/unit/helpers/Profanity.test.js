const chai = require("chai");
const { expect } = chai;

import { profanityCheck } from "../../../helpers/Profanity";

describe("Profanity - Check input", () => {
    it("Expect no profanity error", async () => {
        const word = "hello";
        const profanityResult = profanityCheck(word);

        expect(profanityResult).to.eql(false);
    });

    it("Expect profanity error", async () => {
        const word = "xrated"; // force failure
        const profanityResult = profanityCheck(word);

        expect(profanityResult).to.not.eql(false);
    });
});
