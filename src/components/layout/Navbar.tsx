import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">ShopHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Products
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-indigo-600 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
              <UserIcon className="h-6 w-6" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/cart"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar; 