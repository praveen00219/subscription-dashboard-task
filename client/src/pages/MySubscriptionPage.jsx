import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import Layout from '../components/Layout';
import {
  fetchUserSubscription,
  cancelSubscription,
} from '../store/slices/subscriptionSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const MySubscriptionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userSubscription, isLoading } = useSelector((state) => state.subscription);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    dispatch(fetchUserSubscription());
  }, [dispatch]);

  const handleCancelSubscription = async () => {
    try {
      await dispatch(cancelSubscription()).unwrap();
      toast.success('Subscription cancelled successfully');
      setShowCancelModal(false);
      dispatch(fetchUserSubscription());
    } catch (error) {
      toast.error(error || 'Failed to cancel subscription');
    }
  };

  if (isLoading && !userSubscription) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!userSubscription) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <XCircle size={64} className={`mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>No Active Subscription</h2>
          <p className={`mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>You don&apos;t have an active subscription</p>
          <button
            onClick={() => navigate('/plans')}
            className="py-3 px-6 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-emerald-700 transition"
          >
            View Plans
          </button>
        </div>
      </Layout>
    );
  }

  const isActive = userSubscription.status === 'active';
  const daysRemaining = Math.ceil(
    (new Date(userSubscription.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900/50';
      case 'cancelled':
        return 'text-red-400 bg-red-900/50';
      case 'expired':
        return 'text-gray-400 bg-gray-700/50';
      default:
        return 'text-gray-400 bg-gray-700/50';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text mb-2">
            My Subscription
          </h1>
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Manage your subscription and billing</p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/80 border-gray-200/50 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Subscription Status</h2>
            <span
              className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                userSubscription.status
              )}`}
            >
              {userSubscription.status.toUpperCase()}
            </span>
          </div>

          {isActive && daysRemaining <= 7 && (
            <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle size={24} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-semibold">Subscription Expiring Soon</p>
                <p className="text-yellow-300/80 text-sm">
                  Your subscription will expire in {daysRemaining} days
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Details */}
            <div className={`p-6 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/80'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={24} className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Plan Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Plan Name</p>
                  <p className={`font-semibold text-lg transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {userSubscription.plan?.name}
                  </p>
                </div>
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Price</p>
                  <p className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${userSubscription.plan?.price}/{userSubscription.plan?.duration}
                  </p>
                </div>
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Description</p>
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{userSubscription.plan?.description}</p>
                </div>
              </div>
            </div>

            {/* Billing Details */}
            <div className={`p-6 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/80'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={24} className="text-emerald-400" />
                <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Billing Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Start Date</p>
                  <p className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {new Date(userSubscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>End Date</p>
                  <p className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {new Date(userSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Days Remaining</p>
                  <p className={`font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{isActive ? daysRemaining : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
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
          <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Plan Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userSubscription.plan?.features?.map((feature, index) => (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/80'
              }`}>
                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                <span className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        {isActive && (
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
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Manage Subscription</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/plans')}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-emerald-700 transition"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 py-3 px-6 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
              >
                Cancel Subscription
              </button>
            </div>
          </motion.div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl p-6 max-w-md w-full border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Cancel Subscription?</h3>
              <p className={`mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Are you sure you want to cancel your subscription? You will lose access to all
                premium features at the end of your billing period.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className={`flex-1 py-3 px-4 font-bold rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    'Cancel'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MySubscriptionPage;

