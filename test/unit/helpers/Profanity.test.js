import { profanityCheck } from "../../../src/helpers/Profanity";

describe("Profanity - Check input", () => {
    it("Expect no profanity error", async () => {
        const word = "hello";
        const profanityResult = profanityCheck(word);

        expect(profanityResult).toEqual(false);
    });

    it("Expect profanity error", async () => {
        const word = "xrated"; // force failure
        const profanityResult = profanityCheck(word);

        expect(profanityResult).not.toEqual(false);
    });
});
