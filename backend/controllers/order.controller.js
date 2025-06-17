import { Order, OrderItem, Product, User } from '../models/index.js';
import { sequelize } from '../models/index.js';
import { sendNewOrderNotification, sendOrderConfirmation, sendOrderPaidNotification } from '../services/email.service.js';

// Create a new order
export const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items, shipping_address, payment_method } = req.body;
    const userId = req.user.id;

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        throw new Error(`Product with ID ${item.product_id} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
      shipping_address,
      payment_method,
      status: 'pending',
      payment_status: 'pending'
    }, { transaction: t });

    // Create order items and update stock
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      }, { transaction: t });

      // Update product stock
      await product.update({
        stock: product.stock - item.quantity
      }, { transaction: t });
    }

    // Get order with user and items for email
    const orderWithDetails = await Order.findByPk(order.id, {
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: OrderItem, include: [{ model: Product, attributes: ['name', 'price'] }] }
      ],
      transaction: t
    });

    // Send notifications
    try {
      // Send confirmation to customer
      await sendOrderConfirmation(orderWithDetails.user.email, orderWithDetails);

      // Send notification to all admin users
      const adminUsers = await User.findAll({
        where: { role: 'admin', is_active: true },
        attributes: ['email']
      });

      for (const admin of adminUsers) {
        await sendNewOrderNotification(admin.email, orderWithDetails);
      }
    } catch (emailError) {
      console.error('Error sending order notifications:', emailError);
      // Continue with order creation even if email fails
    }

    await t.commit();
    res.status(201).json(orderWithDetails);
  } catch (error) {
    await t.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status, payment_status } = req.body;

    const order = await Order.findByPk(id, {
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: OrderItem, include: [{ model: Product, attributes: ['name', 'price'] }] }
      ],
      transaction: t
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    await order.update({
      status,
      payment_status,
      ...(payment_status === 'completed' && { payment_reference: req.body.payment_reference })
    }, { transaction: t });

    // If payment is completed, send notifications
    if (payment_status === 'completed') {
      try {
        // Send notification to all admin users
        const adminUsers = await User.findAll({
          where: { role: 'admin', is_active: true },
          attributes: ['email']
        });

        for (const admin of adminUsers) {
          await sendOrderPaidNotification(admin.email, order);
        }
      } catch (emailError) {
        console.error('Error sending payment notifications:', emailError);
        // Continue with order update even if email fails
      }
    }

    await t.commit();
    res.json(order);
  } catch (error) {
    await t.rollback();
    console.error('Update order status error:', error);
    res.status(500).json({ 
      message: 'Error updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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