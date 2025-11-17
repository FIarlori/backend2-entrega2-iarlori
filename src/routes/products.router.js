import express from 'express';
import productController from '../controllers/product.controller.js';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorization.js';

const router = express.Router();

router.post('/', auth, authorize(['admin']), productController.createProduct);
router.get('/', productController.getProducts);
router.put('/:pid', auth, authorize(['admin']), productController.updateProduct);
router.delete('/:pid', auth, authorize(['admin']), productController.deleteProduct);

export default router;