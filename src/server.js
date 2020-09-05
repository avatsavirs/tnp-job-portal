/* Imports */
const express = require('express');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const { port } = require('./config');

/* Initialise Express */
const app = express();

/* Mount Middleware */
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

/* Exports */
module.exports = async function () {
  app.listen(port, function () {
    console.log(`🚀 server on http://localhost:${port}`);
  });
};
