const express = require('express');
const authController = require('../controllers/auth.controllers');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// login routes
router.post('/login', authController.login);

// phone number change routes
router.post('/change-phone-number', authenticate, authController.requestToChangePhoneNumber);
router.post('/verify-phone-otp', authenticate, authController.verifyOtp);

// change password routes for logged user
router.post('/change-password', authenticate, authController.changePassword);

// reset forgotten password routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-password-otp', authController.verifyPasswordOtp);
router.post('/reset-password', authController.resetPassword);

// logout routes
router.post('/logout', authenticate, authController.logout);

module.exports = router;
