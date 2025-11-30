// routes/aboutRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAbout,
  upsertAbout,
  deleteAbout,
} = require('../controllers/aboutController');

// GET: get about data
router.get('/', getAbout);

// POST or PUT: create/update (single document)
// Use POST from admin, but PUT would also work.
router.post('/', upload.single('image'), upsertAbout);
router.put('/', upload.single('image'), upsertAbout);

// Optional delete route
router.delete('/', deleteAbout);

module.exports = router;
