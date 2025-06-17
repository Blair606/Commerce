import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_ENDPOINTS, BACKEND_URL } from '../config/api.config';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  price: number | string;
  description: string;
  image_url: string;
  category: string;
  stock: number;
  features?: string[];
  rating?: number;
  reviews?: number;
  images?: string[];
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINTS.PRODUCTS.ALL}/${id}`);
        const productData = response.data;
        // Ensure price is a number and fix image URLs
        setProduct({
          ...productData,
          price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price,
          image_url: productData.image_url.startsWith('http')
            ? productData.image_url
            : `${BACKEND_URL}/uploads/${productData.image_url}`,
          images: productData.images?.map((image: string) => 
            image.startsWith('http') ? image : `${BACKEND_URL}/uploads/${image}`
          )
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      setAddToCartError('');

      // Get the auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setAddToCartError('Please login to add items to cart');
        return;
      }

      await axios.post(API_ENDPOINTS.CART.ADD, {
        product_id: product.id,
        quantity: quantity
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Show success message and redirect to cart
      navigate('/cart');
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      if (err.response?.status === 401) {
        setAddToCartError('Please login to add items to cart');
      } else if (err.response?.status === 400) {
        setAddToCartError(err.response.data.message || 'Invalid request');
      } else if (err.response?.status === 404) {
        setAddToCartError('Product not found');
      } else if (err.response?.status === 500) {
        setAddToCartError(err.response.data.message || 'Server error occurred');
        console.error('Server error details:', err.response.data.error);
      } else {
        setAddToCartError('Failed to add item to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center py-8">{error || 'Product not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden mb-4">
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
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
                    alt={`${product.name} - ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-5 w-5 ${
                    index < (product.rating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.reviews || 0} reviews)
            </span>
          </div>
          <p className="text-2xl font-bold text-indigo-600 mb-4">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-6">
            <p className={`text-sm font-medium ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.stock > 0
                ? `${product.stock} items in stock`
                : 'Out of stock'}
            </p>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </span>
                )}
              </button>
            </div>
            {addToCartError && (
              <p className="text-red-500 text-sm">{addToCartError}</p>
            )}
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 