import Product from '../models/product.model.js';
import Category from '../models/category.model.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });

    // Format the response to match the frontend expectations
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      stock: product.stock,
      image_url: product.image_url,
      categoryId: product.CategoryId,
      category: product.Category ? product.Category.name : null,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));

    res.json({ products: formattedProducts });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category']
    });
    res.json({ categories: categories.map(c => c.category) });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, image_url, stock } = req.body;

    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'description', 'price', 'categoryId']
      });
    }

    // Validate price is a number
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ 
        message: 'Price must be a valid positive number' 
      });
    }

    // Validate stock is a number if provided
    if (stock !== undefined && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
      return res.status(400).json({ 
        message: 'Stock must be a valid positive number' 
      });
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      CategoryId: parseInt(categoryId),
      image_url,
      stock: stock ? parseInt(stock) : 0
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'Invalid category ID' 
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, stock } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (image_url) product.image_url = image_url;
    if (stock !== undefined) product.stock = stock;

    await product.save();
    res.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 