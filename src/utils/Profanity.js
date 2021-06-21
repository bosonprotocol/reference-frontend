const Filter = require("bad-words");
const filter = new Filter();

filter.addWords(
  "acid",
  "alcohol",
  "amphetamine",
  "cannabis",
  "cocaine",
  "dmt",
  "drugs",
  "ecstasy",
  "heroin",
  "ketamine",
  "lsd",
  "marijuana",
  "mdma",
  "meth",
  "weed"
);

export const profanityCheck = (input) => {
  let profanityResult = filter.isProfane(input);

  return profanityResult ? "Profanity is not allowed" : false;
};
