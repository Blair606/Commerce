import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';

// Mock data for demonstration
const cartItems = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 199.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 299.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  },
];

const Cart = () => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 10;
  const total = subtotal + shipping;

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
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{item.name}</h3>
                    <p className="text-indigo-600 font-bold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-lg">
                      <button className="px-3 py-1 text-gray-600 hover:bg-gray-50">
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button className="px-3 py-1 text-gray-600 hover:bg-gray-50">
                        +
                      </button>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
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
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ${total.toFixed(2)}
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