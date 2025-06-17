import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    console.log('Adding to cart request:', { user_id, product_id, quantity });

    // Validate input
    if (!product_id || !quantity) {
      console.log('Invalid input:', { product_id, quantity });
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    // Validate user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      console.log('User not found:', user_id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product exists and has enough stock
    const product = await Product.findByPk(product_id);
    if (!product) {
      console.log('Product not found:', product_id);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product found:', { 
      id: product.id, 
      name: product.name, 
      stock: product.stock 
    });

    if (product.stock < quantity) {
      console.log('Insufficient stock:', { 
        requested: quantity, 
        available: product.stock 
      });
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Check if item already exists in cart
    let cartItem = await Cart.findOne({
      where: {
        user_id,
        product_id
      },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'image_url', 'stock']
      }]
    });

    if (cartItem) {
      console.log('Updating existing cart item:', { 
        cartItemId: cartItem.id, 
        currentQuantity: cartItem.quantity 
      });
      // Update quantity if item exists
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        console.log('Insufficient stock for update:', { 
          newQuantity, 
          available: product.stock 
        });
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      await cartItem.update({ quantity: newQuantity });
    } else {
      console.log('Creating new cart item');
      // Create new cart item
      cartItem = await Cart.create({
        user_id,
        product_id,
        quantity
      });
    }

    // Return updated cart item with product details
    const updatedCartItem = await Cart.findByPk(cartItem.id, {
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'image_url', 'stock']
      }]
    });

    // Transform the response to match frontend expectations
    const transformedItem = {
      id: updatedCartItem.id,
      product_id: updatedCartItem.product_id,
      quantity: updatedCartItem.quantity,
      name: updatedCartItem.product.name,
      price: updatedCartItem.product.price,
      image_url: updatedCartItem.product.image_url,
      stock: updatedCartItem.product.stock
    };

    console.log('Cart item created/updated successfully:', {
      cartItemId: updatedCartItem.id,
      quantity: updatedCartItem.quantity
    });

    res.json(transformedItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error adding item to cart',
      error: error.message 
    });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    console.log('Fetching cart for user:', user_id);

    const cartItems = await Cart.findAll({
      where: { user_id },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'image_url', 'stock']
      }]
    });

    // Transform the response to match frontend expectations
    const transformedItems = cartItems.map(item => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.product.name,
      price: item.product.price,
      image_url: item.product.image_url,
      stock: item.product.stock
    }));

    console.log('Cart items found:', transformedItems.length);

    res.json({ items: transformedItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error fetching cart',
      error: error.message 
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    console.log('Updating cart item:', { id, quantity, user_id });

    const cartItem = await Cart.findOne({
      where: { id, user_id },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['stock']
      }]
    });

    if (!cartItem) {
      console.log('Cart item not found:', id);
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (quantity > cartItem.product.stock) {
      console.log('Insufficient stock for update:', { 
        requested: quantity, 
        available: cartItem.product.stock 
      });
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    await cartItem.update({ quantity });
    console.log('Cart item updated successfully:', { id, newQuantity: quantity });

    // Return updated cart item with product details
    const updatedCartItem = await Cart.findByPk(id, {
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'image_url', 'stock']
      }]
    });

    // Transform the response to match frontend expectations
    const transformedItem = {
      id: updatedCartItem.id,
      product_id: updatedCartItem.product_id,
      quantity: updatedCartItem.quantity,
      name: updatedCartItem.product.name,
      price: updatedCartItem.product.price,
      image_url: updatedCartItem.product.image_url,
      stock: updatedCartItem.product.stock
    };

    res.json(transformedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error updating cart item',
      error: error.message 
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    console.log('Removing cart item:', { id, user_id });

    const cartItem = await Cart.findOne({
      where: { id, user_id }
    });

    if (!cartItem) {
      console.log('Cart item not found:', id);
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();
    console.log('Cart item removed successfully:', id);

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error removing item from cart',
      error: error.message 
    });
  }
}; 