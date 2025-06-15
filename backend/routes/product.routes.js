import express from 'express';
import { 
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';
import upload from '../config/upload.config.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/categories', getCategories);

// Admin routes
router.post('/', authenticateToken, isAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

export default router; 