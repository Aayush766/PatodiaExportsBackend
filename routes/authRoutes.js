// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  loginUser,
  initialSetup,
  sendResetOtp,
  verifyResetOtp,
  resetPasswordWithOtp,
} = require('../controllers/authController.js');

// DEBUG: make sure this file is actually loaded
console.log('✅ authRoutes.js loaded');

// First-time setup – no auth, backend will block if users already exist
router.post(
  '/initial-setup',
  (req, res, next) => {
    console.log('✅ HIT /api/auth/initial-setup');
    next();
  },
  initialSetup
);

// Normal login
router.post(
  '/login',
  (req, res, next) => {
    console.log('✅ HIT /api/auth/login');
    next();
  },
  loginUser
);

// Forgot password via email - send OTP
router.post(
  '/forgot-password',
  (req, res, next) => {
    console.log('✅ HIT /api/auth/forgot-password');
    next();
  },
  sendResetOtp
);

// Verify OTP
router.post(
  '/verify-reset-otp',
  (req, res, next) => {
    console.log('✅ HIT /api/auth/verify-reset-otp');
    next();
  },
  verifyResetOtp
);

// Reset password after OTP verified
router.post(
  '/reset-password',
  (req, res, next) => {
    console.log('✅ HIT /api/auth/reset-password');
    next();
  },
  resetPasswordWithOtp
);

module.exports = router;
