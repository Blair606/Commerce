import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api.config';
import { useAuth } from '../../context/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  description?: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      setError('You must be logged in as an admin to access this page');
      setLoading(false);
      return;
    }
    fetchCategories();
  }, [isAuthenticated, isAdmin]);

  const fetchCategories = async () => {
    try {
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await axios.get(API_ENDPOINTS.CATEGORIES.ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCategories(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Your session has expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch categories');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      if (!token) {
        throw new Error('No authentication token available');
      }

      await axios.delete(API_ENDPOINTS.CATEGORIES.DELETE(id), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      await fetchCategories();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Your session has expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    if (!token) {
      setSubmitError('Authentication token is missing. Please log in again.');
      setIsSubmitting(false);
      logout();
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      setSubmitError('You must be an admin to perform this action.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim()
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (editingCategory) {
        await axios.put(
          API_ENDPOINTS.CATEGORIES.UPDATE(editingCategory.id),
          payload,
          { headers }
        );
      } else {
        await axios.post(
          API_ENDPOINTS.CATEGORIES.CREATE,
          payload,
          { headers }
        );
      }
      
      handleModalClose();
      await fetchCategories();
    } catch (err: any) {
      console.error('Error saving category:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setSubmitError('Your session has expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setSubmitError(
          err.response?.data?.message || 
          err.message || 
          'Failed to save category. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          You must be logged in as an admin to access this page
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Categories
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Add New Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
            {category.description && (
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={handleModalClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {submitError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    disabled={isSubmitting}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {editingCategory ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingCategory ? 'Update Category' : 'Add Category'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories; 