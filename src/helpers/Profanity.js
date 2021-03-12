var Filter = require('bad-words');
var filter = new Filter();

export const profanityTest = (input) => {
  let profanityResult = filter.isProfane(input);

  return profanityResult ? 'Profanity is not allowed' : false
}