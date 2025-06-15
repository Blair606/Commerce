import express from 'express';
import { 
  getAllProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);

// Admin routes
router.post('/', authenticateToken, isAdmin, createProduct);
router.put('/:id', authenticateToken, isAdmin, updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

export default router; 