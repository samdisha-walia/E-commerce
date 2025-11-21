const express = require('express');
const { listProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/', listProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
