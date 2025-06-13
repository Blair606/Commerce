import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

// Mock data for demonstration
const product = {
  id: 1,
  name: 'Wireless Headphones',
  price: 199.99,
  description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals alike.',
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
  ],
  rating: 4.5,
  reviews: 128,
  category: 'Electronics',
  features: [
    'Active Noise Cancellation',
    '40-hour battery life',
    'Bluetooth 5.0',
    'Premium build quality',
  ],
};

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log('Adding to cart:', { product, quantity });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                ({product.reviews} reviews)
              </span>
            </div>
            <p className="text-3xl font-bold text-indigo-600">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div>
            <h2 className="font-semibold mb-2">Features</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
              >
                -
              </button>
              <span className="px-3 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Add to Cart</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 