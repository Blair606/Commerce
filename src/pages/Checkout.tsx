import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  zipCode: z.string().min(3, 'ZIP code is required'),
  paymentMethod: z.enum(['credit', 'paypal', 'mpesa']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (data: CheckoutFormData) => {
    console.log(data);
    // Handle form submission
  };

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
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="credit"
                          {...register('paymentMethod')}
                          className="text-indigo-600"
                        />
                        <span>Credit Card</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="paypal"
                          {...register('paymentMethod')}
                          className="text-indigo-600"
                        />
                        <span>PayPal</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="mpesa"
                          {...register('paymentMethod')}
                          className="text-indigo-600"
                        />
                        <span>M-Pesa</span>
                      </label>
                    </div>
                    {errors.paymentMethod && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="btn btn-primary ml-auto"
                  >
                    Continue
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary ml-auto">
                    Place Order
                  </button>
                )}
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
                <span className="font-semibold">$499.98</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">$10.00</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-indigo-600">
                    $509.98
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