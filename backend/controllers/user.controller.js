import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import { Op } from 'sequelize';
import { sendNewUserNotification, sendApprovalNotification, sendRejectionNotification } from '../services/email.service.js';

// Validation helper
const validateRegistration = (userData) => {
  const { username, email, password } = userData;
  const errors = [];

  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!email || !email.includes('@')) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  return errors;
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    const validationErrors = validateRegistration(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      is_approved: false // New users are not approved by default
    });

    // Find admin users to notify
    const adminUsers = await User.findAll({
      where: { role: 'admin', is_active: true }
    });

    // Send notification to all admin users
    for (const admin of adminUsers) {
      await sendNewUserNotification(admin.email, user);
    }

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_approved: user.is_approved
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide both email and password' 
      });
    }

    // Find user without checking is_active
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ 
        message: 'Your account has been deactivated. Please contact support.' 
      });
    }

    // Check if user is approved
    if (!user.is_approved) {
      return res.status(403).json({ 
        message: 'Your account is pending approval. Please wait for admin confirmation.' 
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role', 'created_at']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Admin only endpoints
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'is_approved', 'is_active', 'created_at']
    });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ role });
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ is_active: false });
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Error deactivating user' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: userId }
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    // Update user profile
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ username, email });

    // Return updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'role']
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await User.hashPassword(newPassword);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

// Admin only endpoints
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({
      where: {
        is_approved: false,
        is_active: true,
        role: 'user'
      },
      attributes: ['id', 'username', 'email', 'created_at']
    });
    res.json({ pendingUsers });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Error fetching pending users' });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.is_approved) {
      return res.status(400).json({ message: 'User is already approved' });
    }

    await user.update({ is_approved: true });
    
    // Send approval notification email
    await sendApprovalNotification(user.email, user.username);

    res.json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Error approving user' });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.is_approved) {
      return res.status(400).json({ message: 'User is already rejected' });
    }

    await user.update({ is_approved: false });
    
    // Send rejection notification email
    await sendRejectionNotification(user.email, user.username);

    res.json({ message: 'User rejected successfully' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Error rejecting user' });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.count({
      where: { is_active: true }
    });

    // Get pending users count
    const pendingUsers = await User.count({
      where: { is_active: true, is_approved: false }
    });

    // Get new users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.count({
      where: {
        is_active: true,
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Get recent user registrations
    const recentUsers = await User.findAll({
      where: { is_active: true },
      attributes: ['id', 'username', 'email', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      stats: {
        totalUsers,
        pendingUsers,
        newUsers
      },
      recentUsers
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

export const reactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.is_active) {
      return res.status(400).json({ message: 'User is already active' });
    }

    await user.update({ is_active: true });
    res.json({ message: 'User reactivated successfully' });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({ message: 'Error reactivating user' });
  }
}; 