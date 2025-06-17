import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  stock: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.CART.ALL);
        // Ensure all prices are numbers
        const items = response.data.items.map((item: any) => ({
          ...item,
          price: Number(item.price)
        }));
        setCartItems(items);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;

    // Validate against stock
    if (newQuantity > item.stock) {
      setError(`Only ${item.stock} items available in stock`);
      return;
    }

    try {
      setUpdating(itemId);
      const response = await axios.put(API_ENDPOINTS.CART.UPDATE(itemId), {
        quantity: newQuantity
      });
      
      // Update cart items with the response data
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      setError('');
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await axios.delete(`${API_ENDPOINTS.CART.DELETE}/${itemId}`);
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
    }
  };

  // Format price to KES
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + (Number(item.price) * item.quantity),
    0
  );
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm divide-y">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="p-6 flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-8 bg-gray-200 rounded" />
                      <div className="w-8 h-8 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-8 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm divide-y">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 flex items-center space-x-6"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{item.name}</h3>
                    <p className="text-indigo-600 font-bold">
                      {formatPrice(Number(item.price))}
                    </p>
                    {item.quantity > item.stock && (
                      <p className="text-red-500 text-sm mt-1">
                        Only {item.stock} items available
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        disabled={item.quantity <= 1 || updating === item.id}
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        disabled={item.quantity >= item.stock || updating === item.id}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={updating === item.id}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full bg-indigo-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 