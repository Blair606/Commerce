import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const features = [
    {
      icon: <ShoppingBagIcon className="h-6 w-6" />,
      title: 'Wide Selection',
      description: 'Browse through thousands of products across various categories',
    },
    {
      icon: <TruckIcon className="h-6 w-6" />,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly and reliably',
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: 'Secure Shopping',
      description: 'Shop with confidence with our secure payment system',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const categoriesResponse = await axios.get(API_ENDPOINTS.CATEGORIES.ALL);
        setCategories(categoriesResponse.data);

        // Fetch featured products (you might want to add a specific endpoint for this)
        const productsResponse = await axios.get(API_ENDPOINTS.PRODUCTS.ALL);
        // Get 4 random products or the latest products
        const products = productsResponse.data.products || [];
        const featured = products.slice(0, 4);
        setFeaturedProducts(featured);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format price to KES
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Discover Amazing Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl mb-8 text-indigo-100"
            >
              Shop the latest trends with our curated collection of premium products
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/products"
                className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-indigo-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-indigo-600 font-bold">{formatPrice(product.price)}</p>
                    {product.stock < 5 && (
                      <p className="text-red-500 text-sm mt-1">Only {product.stock} left in stock</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <Link 
                  to={`/products?category=${category.name}`}
                  className="block"
                >
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-xl font-semibold group-hover:scale-105 transition-transform">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home; 