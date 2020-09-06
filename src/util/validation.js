function isInteger(num) {
  if (typeof num !== 'number') return false;
  return Number.isInteger(num);
}

function isNotEmpty(str) {
  if (typeof str !== 'string') return false;
  return str.trim() !== '';
}

function containsNumber(str) {
  return /.*[0-9].*/.test(str);
}

function containsSpecialChar(str) {
  return /.*\W.*/.test(str); // underscore(_) is not a special character
}

function containsUpperCaseAndLowerCase(str) {
  return /(?=.*?[a-z])(?=.*?[A-Z])/.test(str);
}

module.exports = {
  isInteger,
  isNotEmpty,
  containsNumber,
  containsSpecialChar,
  containsUpperCaseAndLowerCase
};
