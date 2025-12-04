const express = require('express');
const router = express.Router();
const { 
    saveMessage, 
    getAllMessages, 
    deleteMessage 
} = require('../controllers/contactController');

router.route('/').post(saveMessage);


router.route('/').get(getAllMessages); 
router.route('/:id').delete(deleteMessage);

module.exports = router;