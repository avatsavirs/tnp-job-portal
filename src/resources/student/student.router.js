const express = require('express');
const router = express.Router();
const { getUser } = require('./student.controllers');
router.route('/').get(getUser);

module.exports = router;
