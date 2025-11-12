import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Shield, User, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchAllUsers } from '../store/slices/adminSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((user) => {
    // Exclude admin users from the display
    if (user.role === 'admin') return false;
    
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (isLoading && users.length === 0) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text mb-2">
            Manage Users
          </h1>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>View and manage all registered users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className={`px-4 py-3 rounded-lg border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            <option value="all">All Users</option>
            <option value="user">Regular Users</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/80 border-gray-200/50 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <User size={24} className="text-white" />
              </div>
              <div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Total Users</p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{users.filter((u) => u.role !== 'admin').length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/80 border-gray-200/50 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Verified Users</p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {users.filter((u) => u.isVerified).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/80 border-gray-200/50 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Admin Users</p>
                <p className={`text-2xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {users.filter((u) => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-lg rounded-xl border overflow-hidden transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/80 border-gray-200/50 shadow-lg'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/80'
              }`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>User</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Email</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Role</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Subscription
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className={`transition-colors duration-300 ${
                isDarkMode ? 'divide-y divide-gray-700/50' : 'divide-y divide-gray-200/50'
              }`}>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`transition-colors duration-300 ${
                      isDarkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Mail size={16} />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-purple-200/50 text-purple-400'
                            : 'bg-blue-200/50 text-blue-400'
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isVerified ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle size={16} />
                          <span className="text-sm">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle size={16} />
                          <span className="text-sm">Unverified</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {user.subscription ? user.subscription.plan?.name : 'None'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Calendar size={16} />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>No users found</p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminUsersPage;

