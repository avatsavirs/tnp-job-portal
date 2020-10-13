const express = require('express');
const router = express.Router();
const { getTnpUser } = require('./tnp.controllers');
router.route('/').get(getTnpUser);

module.exports = router;
