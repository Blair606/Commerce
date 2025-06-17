import sequelize from '../config/database.js';
import User from './user.model.js';
import Product from './product.model.js';
import Category from './category.model.js';
import Cart from './cart.model.js';

// Define associations
Product.belongsTo(Category, { 
  foreignKey: 'category_id',
  as: 'category'
});
Category.hasMany(Product, { 
  foreignKey: 'category_id',
  as: 'products'
});

// Cart associations
Cart.belongsTo(User, { 
  foreignKey: 'user_id',
  as: 'user'
});
Cart.belongsTo(Product, { 
  foreignKey: 'product_id',
  as: 'product'
});
User.hasMany(Cart, { 
  foreignKey: 'user_id',
  as: 'cartItems'
});
Product.hasMany(Cart, { 
  foreignKey: 'product_id',
  as: 'cartItems'
});

export {
  sequelize,
  User,
  Product,
  Category,
  Cart
}; 