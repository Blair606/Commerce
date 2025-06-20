import Product from '../models/product.model.js';
import Category from '../models/category.model.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        attributes: ['name'],
        as: 'category'
      }]
    });

    // Transform the response to include category name
    const transformedProducts = products.map(product => ({
      ...product.toJSON(),
      category: product.category ? product.category.name : null
    }));

    res.json({ products: transformedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'description']
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Category,
        attributes: ['name'],
        as: 'category'
      }]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Transform the response to include category name
    const transformedProduct = {
      ...product.toJSON(),
      category: product.category ? product.category.name : null
    };

    res.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    
    // Handle image upload
    let image_url = null;
    if (req.file) {
      image_url = `${process.env.API_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category_id,
      image_url
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle image upload
    let image_url = product.image_url;
    if (req.file) {
      image_url = `${process.env.API_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    }

    await product.update({
      name,
      description,
      price,
      stock,
      category_id,
      image_url
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
}; 