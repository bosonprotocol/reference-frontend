const Filter = require('bad-words');
const filter = new Filter();

export const profanityCheck = (input) => {
  let profanityResult = filter.isProfane(input);

  return profanityResult ? 'Profanity is not allowed' : false
}