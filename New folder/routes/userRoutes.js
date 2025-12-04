const express = require('express');
const router = express.Router();
const { setInitialPassword } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');


router.put('/set-password', protect, setInitialPassword);

module.exports = router;