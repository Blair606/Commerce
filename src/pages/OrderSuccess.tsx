import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

interface Order {
  id: string;
  status: string;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  payment_method: string;
  created_at: string;
}

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINTS.ORDERS.GET(Number(orderId))}`);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            {error || 'Order not found'}
          </h2>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Order ID:</span>{' '}
                  <span className="font-medium">{order.id}</span>
                </p>
                <p>
                  <span className="text-gray-600">Date:</span>{' '}
                  <span className="font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Status:</span>{' '}
                  <span className="font-medium capitalize">{order.status}</span>
                </p>
                <p>
                  <span className="text-gray-600">Payment Method:</span>{' '}
                  <span className="font-medium capitalize">
                    {order.payment_method}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-2">
                <p className="font-medium">
                  {order.shipping_address.firstName} {order.shipping_address.lastName}
                </p>
                <p>{order.shipping_address.address}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.country}{' '}
                  {order.shipping_address.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-indigo-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess; 