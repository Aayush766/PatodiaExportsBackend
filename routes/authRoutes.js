// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginUser, initialSetup } = require('../controllers/authController.js');

// DEBUG: make sure this file is actually loaded
console.log('✅ authRoutes.js loaded');

// First-time setup – no auth, backend will block if users already exist
router.post('/initial-setup', (req, res, next) => {
  console.log('✅ HIT /api/auth/initial-setup');
  next();
}, initialSetup);

// Normal login
router.post('/login', (req, res, next) => {
  console.log('✅ HIT /api/auth/login');
  next();
}, loginUser);

module.exports = router;
