import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Package,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Layout from '../components/Layout';
import { fetchUserSubscription } from '../store/slices/subscriptionSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';

const StatCard = ({ icon: Icon, label, value, color, link, isDarkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600' 
        : 'bg-white/80 border-gray-200/50 hover:border-gray-300 shadow-lg'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className={`text-sm mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>{label}</p>
        <h3 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>{value}</h3>
        {link && (
          <Link to={link} className={`text-sm hover:underline transition-colors duration-300 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            View Details →
          </Link>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { userSubscription, isLoading } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    dispatch(fetchUserSubscription());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const isActive = userSubscription?.status === 'active';
  const daysRemaining = userSubscription?.endDate
    ? Math.ceil((new Date(userSubscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Here&apos;s an overview of your subscription status
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={CreditCard}
            label="Subscription Status"
            value={userSubscription ? userSubscription.status.toUpperCase() : 'No Subscription'}
            color={isActive ? 'from-green-500 to-emerald-600' : 'from-gray-500 to-gray-600'}
            link="/my-subscription"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={Package}
            label="Current Plan"
            value={userSubscription?.plan?.name || 'None'}
            color="from-blue-500 to-blue-600"
            link="/plans"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={Calendar}
            label="Days Remaining"
            value={isActive ? daysRemaining : '—'}
            color="from-purple-500 to-purple-600"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Subscription Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/80 border-gray-200/50 shadow-lg'
          }`}
        >
          <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <TrendingUp size={24} className={`transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            Subscription Details
          </h2>

          {userSubscription ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/80'
                }`}>
                  <p className={`text-sm mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Plan Name</p>
                  <p className={`font-semibold text-lg transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {userSubscription.plan?.name}
                  </p>
                </div>
                <div className={`p-4 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/80'
                }`}>
                  <p className={`text-sm mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Price</p>
                  <p className={`font-semibold text-lg transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${userSubscription.plan?.price}/{userSubscription.plan?.duration}
                  </p>
                </div>
                <div className={`p-4 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/80'
                }`}>
                  <p className={`text-sm mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Start Date</p>
                  <p className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {new Date(userSubscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className={`p-4 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/80'
                }`}>
                  <p className={`text-sm mb-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>End Date</p>
                  <p className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {new Date(userSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className={`p-4 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/80'
              }`}>
                <p className={`text-sm mb-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Plan Features</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {userSubscription.plan?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-400" />
                      <span className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Link
                  to="/plans"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold rounded-lg text-center hover:from-blue-600 hover:to-emerald-700 transition"
                >
                  Upgrade Plan
                </Link>
                <Link
                  to="/my-subscription"
                  className={`flex-1 py-3 px-4 font-bold rounded-lg text-center transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  Manage Subscription
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <XCircle size={64} className={`mx-auto mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No Active Subscription
              </h3>
              <p className={`mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Subscribe to a plan to access all features
              </p>
              <Link
                to="/plans"
                className="inline-block py-3 px-6 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-emerald-700 transition"
              >
                View Plans
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default DashboardPage;

