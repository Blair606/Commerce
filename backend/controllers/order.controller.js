import { Order, OrderItem, Product, User } from '../models/index.js';
import { sequelize } from '../models/index.js';

// Create a new order
export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { items, ...orderData } = req.body;
    const userId = req.user.id;

    // Create the order
    const order = await Order.create({
      ...orderData,
      user_id: userId,
      status: 'pending',
      total_amount: 0 // Will be calculated below
    }, { transaction });

    // Create order items and calculate total
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        throw new Error(`Product with ID ${item.product_id} not found`);
      }

      // Check stock
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      // Create order item
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      }, { transaction });

      // Update product stock
      await product.update({
        stock: product.stock - item.quantity
      }, { transaction });

      totalAmount += product.price * item.quantity;
    }

    // Update order total
    await order.update({
      total_amount: totalAmount
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order.id,
      order: {
        id: order.id,
        total_amount: order.total_amount,
        status: order.status
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(400).json({
      message: error.message || 'Failed to create order'
    });
  }
};

// Get all orders for the authenticated user
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [{
        model: OrderItem,
        include: [{
          model: Product,
          attributes: ['name', 'image_url']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get a specific order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, user_id: userId },
      include: [{
        model: OrderItem,
        include: [{
          model: Product,
          attributes: ['name', 'image_url', 'price']
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    const order = await Order.findOne({
      where: { id, user_id: userId }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });
    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, user_id: userId },
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    // Restore product stock
    for (const item of order.OrderItems) {
      await item.Product.update({
        stock: item.Product.stock + item.quantity
      }, { transaction });
    }

    // Update order status
    await order.update({
      status: 'cancelled'
    }, { transaction });

    await transaction.commit();
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    await transaction.rollback();
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
}; 