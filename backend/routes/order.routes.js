import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrder, cancelOrder } from '../controllers/order.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new order
router.post('/', authenticateToken, createOrder);

// Get all orders for the authenticated user
router.get('/', authenticateToken, getOrders);

// Get a specific order by ID
router.get('/:id', authenticateToken, getOrderById);

// Update an order
router.put('/:id', authenticateToken, updateOrder);

// Cancel an order
router.post('/:id/cancel', authenticateToken, cancelOrder);

export default router; 