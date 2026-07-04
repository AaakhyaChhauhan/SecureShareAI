const { customAlphabet } = require('nanoid');

// Generate URL-safe share codes: 8 characters, alphanumeric
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 8);

const generateShareCode = () => {
  return nanoid();
};

module.exports = generateShareCode;
