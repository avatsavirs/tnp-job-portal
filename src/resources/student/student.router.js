const express = require('express');
const router = express.Router();
const { getUser, updateProfile } = require('./student.controllers');

router.route('/').get(getUser);
router.route('/profile').post(updateProfile);

module.exports = router;
