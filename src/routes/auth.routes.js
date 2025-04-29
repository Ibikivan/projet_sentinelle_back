const express = require('express');
const authController = require('../controllers/auth.controllers');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/change-phone-number', authenticate, authController.requestToChangePhoneNumber);

module.exports = router;
