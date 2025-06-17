import { sequelize, User, Product, Category, Cart } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const initDatabase = async () => {
  try {
    // Sync all models with the database without forcing recreation
    await sequelize.sync({ alter: true }); // Use alter: true to update tables without dropping them
    console.log('Database synchronized successfully');

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        is_approved: true,
        is_active: true
      });
      console.log('Admin user created');
    }

    // Create some initial categories if they don't exist
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Fashion and apparel' },
      { name: 'Books', description: 'Books and publications' }
    ];

    for (const category of categories) {
      const exists = await Category.findOne({ where: { name: category.name } });
      if (!exists) {
        await Category.create(category);
      }
    }
    console.log('Initial categories checked/created');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Let the application handle the error
  }
}; 