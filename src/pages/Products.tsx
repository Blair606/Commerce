import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FunnelIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_ENDPOINTS, BACKEND_URL } from '../config/api.config';

interface Product {
  id: number;
  name: string;
  price: number | string;
  image_url: string;
  category: string;
  description: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(API_ENDPOINTS.PRODUCTS.ALL),
          axios.get(API_ENDPOINTS.CATEGORIES.ALL)
        ]);
        // Ensure prices are numbers and fix image URLs
        const productsWithNumericPrices = productsRes.data.products.map((product: Product) => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          image_url: product.image_url.startsWith('http') 
            ? product.image_url 
            : `${BACKEND_URL}/uploads/${product.image_url}`
        }));
        setProducts(productsWithNumericPrices);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products and categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card overflow-hidden animate-pulse">
              <div className="aspect-w-1 aspect-h-1 bg-gray-200" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden flex items-center space-x-2 text-gray-600"
        >
          <FunnelIcon className="h-5 w-5" />
          <span>Filter</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg mb-6 text-gray-800">Categories</h2>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                  selectedCategory === 'All'
                    ? 'bg-indigo-100 text-indigo-700 font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex-1">All</span>
                {selectedCategory === 'All' && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                )}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                    selectedCategory === category.name
                      ? 'bg-indigo-100 text-indigo-700 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="flex-1">{category.name}</span>
                  {selectedCategory === category.name && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters - Mobile */}
        {isFilterOpen && (
          <div className="md:hidden bg-white p-6 rounded-xl shadow-sm mb-4">
            <h2 className="font-semibold text-lg mb-6 text-gray-800">Categories</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setIsFilterOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                  selectedCategory === 'All'
                    ? 'bg-indigo-100 text-indigo-700 font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex-1">All</span>
                {selectedCategory === 'All' && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                )}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                    selectedCategory === category.name
                      ? 'bg-indigo-100 text-indigo-700 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="flex-1">{category.name}</span>
                  {selectedCategory === category.name && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card overflow-hidden"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-indigo-600 font-bold">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 