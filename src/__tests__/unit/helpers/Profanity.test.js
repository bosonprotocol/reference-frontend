const chai = require("chai");
const { expect } = chai;

import { profanityTest } from "../../../helpers/Profanity";

describe("Profanity - Check input", () => {
    it("Expect no profanity error", async () => {
        const word = "hello";
        const profanityResult = profanityTest(word);

        expect(profanityResult).to.eql(false);
    });

    it("Expect profanity error", async () => {
        const word = "xrated"; // force failure
        const profanityResult = profanityTest(word);

        expect(profanityResult).to.not.eql(false);
    });
});
