import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';
import { useNavigate } from 'react-router-dom';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  zipCode: z.string().min(3, 'ZIP code is required'),
  paymentMethod: z.enum(['cod', 'mpesa', 'paypal']),
  mpesaNumber: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod'
    }
  });

  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.CART.ALL);
        setCartItems(response.data.items);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const onSubmit = async (data: CheckoutFormData) => {
    if (step === 3) {
      try {
        setSubmitting(true);
        const orderData = {
          ...data,
          items: cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
          }))
        };
        
        const response = await axios.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
        setOrderId(response.data.orderId);
        
        // Clear cart after successful order
        await axios.post(API_ENDPOINTS.CART.CLEAR);
        
        // Navigate to success page with order ID
        navigate(`/order-success/${response.data.orderId}`);
      } catch (err) {
        console.error('Error creating order:', err);
        setError('Failed to create order. Please try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
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
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-full" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
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

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {['Shipping', 'Payment', 'Review'].map((stepName, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index < step ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      index < step
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2">{stepName}</span>
                  {index < 2 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        index < step ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="input"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="input"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="input"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="input"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      {...register('address')}
                      className="input"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        {...register('city')}
                        className="input"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        {...register('country')}
                        className="input"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        {...register('zipCode')}
                        className="input"
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          value="cod"
                          {...register('paymentMethod')}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <span>Cash on Delivery</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          value="mpesa"
                          {...register('paymentMethod')}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <span>M-Pesa</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          value="paypal"
                          {...register('paymentMethod')}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <span>PayPal</span>
                      </label>
                    </div>
                    {errors.paymentMethod && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  {paymentMethod === 'mpesa' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        M-Pesa Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register('mpesaNumber')}
                        className="input"
                        placeholder="Enter your M-Pesa number"
                      />
                      {errors.mpesaNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.mpesaNumber.message}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : step === 3 ? 'Place Order' : 'Continue'}
                </button>
              </div>
            </form>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 