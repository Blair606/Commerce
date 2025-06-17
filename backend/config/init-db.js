import sequelize from './database.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const initDatabase = async () => {
  try {
    // Sync all models with the database
    // Only force: true in development when you want to recreate tables
    // Use alter: true only when you need to modify existing tables
    await sequelize.sync({ alter: false });
    console.log('Database synchronized successfully');

    // Check if admin user exists
    const adminExists = await User.findOne({
      where: { role: 'admin' }
    });

    if (!adminExists) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        is_approved: true,
        is_active: true
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}; 