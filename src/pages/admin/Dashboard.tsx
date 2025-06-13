import { Link, useLocation, Routes, Route } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Users from './Users';
import Products from './Products';
import Settings from './Settings';

// Mock data for demonstration
const stats = [
  {
    name: 'Total Users',
    value: '1,234',
    change: '+12%',
    icon: UsersIcon,
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-600',
  },
  {
    name: 'Total Sales',
    value: '$45,678',
    change: '+8%',
    icon: ShoppingBagIcon,
    color: 'from-green-500 to-emerald-600',
    textColor: 'text-green-600',
  },
  {
    name: 'Active Products',
    value: '567',
    change: '+5%',
    icon: ChartBarIcon,
    color: 'from-purple-500 to-pink-600',
    textColor: 'text-purple-600',
  },
];

const navigation = [
  { 
    name: 'Overview', 
    href: '/admin', 
    icon: ChartBarIcon,
    color: 'from-blue-500 to-indigo-600',
    hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
  },
  { 
    name: 'Users', 
    href: '/admin/users', 
    icon: UsersIcon,
    color: 'from-green-500 to-emerald-600',
    hoverColor: 'hover:from-green-600 hover:to-emerald-700',
  },
  { 
    name: 'Products', 
    href: '/admin/products', 
    icon: ShoppingBagIcon,
    color: 'from-purple-500 to-pink-600',
    hoverColor: 'hover:from-purple-600 hover:to-pink-700',
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Cog6ToothIcon,
    color: 'from-gray-500 to-gray-600',
    hoverColor: 'hover:from-gray-600 hover:to-gray-700',
  },
];

const Overview = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                        <stat.icon
                          className={`h-6 w-6 ${stat.textColor}`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3">
                  <div className="text-sm">
                    <span className={`${stat.textColor} font-medium`}>
                      {stat.change}
                    </span>{' '}
                    <span className="text-gray-500">from last month</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item * 0.1 }}
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 bg-opacity-10">
                          <UsersIcon
                            className="h-6 w-6 text-blue-600"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          New user registration
                        </p>
                        <p className="text-sm text-gray-500">
                          John Doe registered a new account
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        2 hours ago
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-lg">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Admin Panel
        </span>
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                    : `text-gray-600 hover:text-white hover:bg-gradient-to-r ${item.hoverColor}`
                }`}
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className={`mr-3 h-6 w-6 transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-white'
                  }`}
                >
                  <item.icon aria-hidden="true" />
                </motion.div>
                <span className="relative">
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex h-screen">
        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 bg-white shadow-lg"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <Sidebar />
          </div>
        </div>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleSidebar}
                className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
              />
              {/* Sidebar */}
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
              >
                <Sidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/users" element={<Users />} />
              <Route path="/products" element={<Products />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 