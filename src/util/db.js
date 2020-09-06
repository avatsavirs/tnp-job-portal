const mongoose = require('mongoose');
const { dbUrl } = require('../config');

module.exports = function dbConnect(url = dbUrl, options = {}) {
  return mongoose.connect(url, {
    ...options,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
};
