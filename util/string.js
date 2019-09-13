exports.removeExtraWhitespace = str => {
  const newStr = str.replace(/\s+/g, ' ');
  if (newStr != null) {
    return newStr.trim();
  }
  return null;
};

exports.getWords = (str, { userWordIndex = 0, lastWord = false } = {}) => {
  const words = str.match(/[a-zA-Z\u00C0-\u017F\s]+/g);
  let wordIndex = userWordIndex;
  if (words != null) {
    if (lastWord) {
      wordIndex = words.length - 1;
    }
    if (typeof words[wordIndex] === 'undefined') {
      return null;
    }
    return words[wordIndex];
  }
  return null;
};

exports.toTitleCase = str => {
  const output = str.replace(/(\S)(\S*)/g, (word, firstChar, rest) => {
    const numerals = [
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X'
    ];
    if (numerals.includes(word)) {
      return word;
    }
    const lastChar = rest.charAt(rest.length - 1);
    if (firstChar === '(' && lastChar === ')') {
      return '';
    }
    if (word.length > 2) {
      return firstChar + rest.toLowerCase();
    }
    return word.toLowerCase();
  });
  return exports.removeExtraWhitespace(output);
};
