const joi = require('@hapi/joi');

function containsNumber(str) {
  return /.*[0-9].*/.test(str);
}

function containsSpecialChar(str) {
  return /.*[\W_].*/.test(str); // underscore(_) is not a special character
}

function containsUpperCaseAndLowerCase(str) {
  return /(?=.*?[a-z])(?=.*?[A-Z])/.test(str);
}

function isStudentEmail(email) {
  return /^\d{7}@kiit\.ac\.in/.test(email);
}

function isAlphabetical(str) {
  return /^([a-z]\s?)*\s*$/i.test(str);
}

function isYear(year) {
  return /^\d{4}$/.test(year);
}

function isPincode(pincode) {
  return /^\d{6}$/.test(pincode);
}

function isURL(url) {
  return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url);
}

module.exports = {
  isURL,
  isPincode,
  isYear,
  isStudentEmail,
  containsNumber,
  containsSpecialChar,
  containsUpperCaseAndLowerCase,
  isAlphabetical
};
