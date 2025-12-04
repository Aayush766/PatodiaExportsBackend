const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.route('/')
  .get(getAllProducts)
  .post(upload.single('image'), createProduct);

router.route('/:id')
  .put(upload.single('image'), updateProduct)
  .delete(deleteProduct);

module.exports = router;