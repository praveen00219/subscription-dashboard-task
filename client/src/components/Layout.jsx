import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CreditCard,
  Package,
  Menu,
  X,
  LogOut,
  UserCircle,
  ChevronDown,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Define menu items based on user role
  const menuItems = user?.role === 'admin'
    ? [
        // Admin-only features
        { path: '/admin', icon: Shield, label: 'Admin Dashboard' },
        { path: '/admin/plans', icon: Package, label: 'Manage Plans' },
        { path: '/admin/users', icon: UserCircle, label: 'Manage Users' },
      ]
    : [
        // User-only features
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/plans', icon: Package, label: 'Subscription Plans' },
        { path: '/my-subscription', icon: CreditCard, label: 'My Subscription' },
      ];

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50'
    }`}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed left-0 top-0 h-full w-64 backdrop-blur-lg border-r z-50 flex flex-col transition-colors duration-500 ${
              isDarkMode 
                ? 'bg-gray-900/95 border-gray-700/50' 
                : 'bg-white/95 border-gray-200/50 shadow-xl'
            }`}
          >
            {/* Logo */}
            <div className={`p-6 border-b transition-colors duration-500 ${
              isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
                Subscription Pro
              </h1>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-sm transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Management Portal</p>
                {user?.role === 'admin' && (
                  <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center gap-1">
                    <Shield size={12} />
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                          : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Theme Toggle */}
            <div className={`p-4 border-t transition-colors duration-500 ${
              isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}>
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-800' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
                <motion.div
                  initial={false}
                  animate={{
                    rotate: isDarkMode ? 0 : 180,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'bg-yellow-400/20 text-yellow-600'
                  }`}
                >
                  {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                </motion.div>
              </button>
            </div>

            {/* User Profile */}
            <div className={`p-4 border-t transition-colors duration-500 ${
              isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-800' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <UserCircle size={24} className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{user?.name}</p>
                    <p className={`text-xs capitalize transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{user?.role}</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-all duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    } ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute bottom-full left-0 right-0 mb-2 rounded-lg shadow-xl border overflow-hidden transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-300 ${
                          isDarkMode 
                            ? 'text-red-400 hover:bg-gray-700' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <LogOut size={18} />
                        <span className="text-sm">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className={`backdrop-blur-lg border-b sticky top-0 z-40 transition-colors duration-500 ${
          isDarkMode 
            ? 'bg-gray-900/50 border-gray-700/50' 
            : 'bg-white/50 border-gray-200/50'
        }`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 hover:bg-gray-800 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{user?.name}</p>
                <p className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

