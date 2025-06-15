import sequelize from './database.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

const initDatabase = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        is_approved: true
      });
      console.log('Admin user created successfully');
    }

    // Create some sample products if none exist
    const productCount = await Product.count();
    if (productCount === 0) {
      await Product.bulkCreate([
        {
          name: 'Sample Product 1',
          description: 'This is a sample product description',
          price: 99.99,
          category: 'Electronics',
          image_url: 'https://via.placeholder.com/150',
          stock: 100
        },
        {
          name: 'Sample Product 2',
          description: 'Another sample product description',
          price: 149.99,
          category: 'Clothing',
          image_url: 'https://via.placeholder.com/150',
          stock: 50
        }
      ]);
      console.log('Sample products created successfully');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

export { initDatabase }; 