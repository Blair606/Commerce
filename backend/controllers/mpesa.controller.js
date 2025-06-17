const { Order, OrderItem, Product } = require('../models');
const { sequelize } = require('../models');

exports.handleCallback = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      Body: {
        stkCallback: {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata
        }
      }
    } = req.body;

    if (ResultCode === 0) {
      // Payment successful
      const {
        Amount,
        MpesaReceiptNumber,
        TransactionDate,
        PhoneNumber
      } = CallbackMetadata.Item;

      // Update order status
      const order = await Order.findOne({
        where: { payment_reference: CheckoutRequestID },
        transaction: t
      });

      if (!order) {
        throw new Error('Order not found');
      }

      await order.update({
        status: 'paid',
        payment_status: 'completed',
        payment_method: 'mpesa',
        payment_reference: MpesaReceiptNumber,
        payment_details: {
          amount: Amount,
          receipt_number: MpesaReceiptNumber,
          transaction_date: TransactionDate,
          phone_number: PhoneNumber
        }
      }, { transaction: t });

      await t.commit();
      res.status(200).json({ message: 'Payment processed successfully' });
    } else {
      // Payment failed
      const order = await Order.findOne({
        where: { payment_reference: CheckoutRequestID },
        transaction: t
      });

      if (order) {
        await order.update({
          status: 'payment_failed',
          payment_status: 'failed',
          payment_details: {
            error: ResultDesc
          }
        }, { transaction: t });
      }

      await t.commit();
      res.status(200).json({ message: 'Payment failed' });
    }
  } catch (error) {
    await t.rollback();
    console.error('Error processing M-Pesa callback:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

exports.queryPayment = async (req, res) => {
  try {
    const { CheckoutRequestID } = req.body;

    const order = await Order.findOne({
      where: { payment_reference: CheckoutRequestID }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      status: order.status,
      payment_status: order.payment_status,
      payment_details: order.payment_details
    });
  } catch (error) {
    console.error('Error querying payment:', error);
    res.status(500).json({ error: 'Failed to query payment status' });
  }
}; 