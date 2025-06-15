import Product from '../models/product.model.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({ products });
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
    const { name, description, price, category, image_url, stock } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image_url,
      stock: stock || 0
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product error:', error);
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