import express from 'express';
import { 
  register, 
  login, 
  getProfile,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  updateProfile,
  changePassword,
  getPendingUsers,
  approveUser,
  rejectUser,
  getDashboardStats,
  reactivateUser
} from '../controllers/user.controller.js';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

// Admin only routes
router.get('/all', authenticateToken, isAdmin, getAllUsers);
router.get('/pending', authenticateToken, isAdmin, getPendingUsers);
router.get('/dashboard-stats', authenticateToken, isAdmin, getDashboardStats);
router.put('/:userId/role', authenticateToken, isAdmin, updateUserRole);
router.put('/:userId/deactivate', authenticateToken, isAdmin, deactivateUser);
router.put('/:userId/reactivate', authenticateToken, isAdmin, reactivateUser);
router.put('/:userId/approve', authenticateToken, isAdmin, approveUser);
router.put('/:userId/reject', authenticateToken, isAdmin, rejectUser);

export default router; 