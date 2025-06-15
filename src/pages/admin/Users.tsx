import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api.config';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.USERS.ALL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleApprove = async (userId: number) => {
    try {
      await axios.put(
        API_ENDPOINTS.USERS.APPROVE(userId),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to approve user. Please try again.');
      console.error('Error approving user:', err);
    }
  };

  const handleReject = async (userId: number) => {
    try {
      await axios.put(
        API_ENDPOINTS.USERS.REJECT(userId),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to reject user. Please try again.');
      console.error('Error rejecting user:', err);
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'user' | 'admin') => {
    try {
      await axios.put(
        API_ENDPOINTS.USERS.ROLE(userId),
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to update user role. Please try again.');
      console.error('Error updating user role:', err);
    }
  };

  const handleDeactivate = async (userId: number) => {
    try {
      await axios.put(
        API_ENDPOINTS.USERS.DEACTIVATE(userId),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to deactivate user. Please try again.');
      console.error('Error deactivating user:', err);
    }
  };

  const handleReactivate = async (userId: number) => {
    try {
      await axios.put(
        API_ENDPOINTS.USERS.REACTIVATE(userId),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to reactivate user. Please try again.');
      console.error('Error reactivating user:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
        User Management
      </h1>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                      className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="user">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      !user.is_active
                        ? 'bg-red-100 text-red-800'
                        : user.is_approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {!user.is_active ? 'Deactivated' : user.is_approved ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!user.is_active ? (
                      <button
                        onClick={() => handleReactivate(user.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Reactivate
                      </button>
                    ) : !user.is_approved ? (
                      <>
                        <button
                          onClick={() => handleApprove(user.id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Users; 