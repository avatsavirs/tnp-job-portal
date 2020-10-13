const express = require('express');
const router = express.Router();
const { getUser, updateAddress } = require('./student.controllers');

router.route('/').get(getUser);
router.route('/profile/address').post(updateAddress);

module.exports = router;
