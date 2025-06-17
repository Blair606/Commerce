import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart
} from '../controllers/cart.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart routes
router.post('/add', addToCart);
router.get('/', getCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeFromCart);

export default router; 