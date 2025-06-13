import { motion } from 'framer-motion';

const Products = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
        Product Management
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Books</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
            Add New Product
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((product) => (
            <motion.div
              key={product}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: product * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Product Image</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Name</h3>
                <p className="text-gray-500 text-sm mt-1">Category</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">$99.99</span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Products; 