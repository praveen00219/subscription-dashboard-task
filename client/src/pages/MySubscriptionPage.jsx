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

const MySubscriptionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userSubscription, isLoading } = useSelector((state) => state.subscription);
  const [showCancelModal, setShowCancelModal] = useState(false);

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
          <XCircle size={64} className="text-gray-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Active Subscription</h2>
          <p className="text-gray-400 mb-6">You don&apos;t have an active subscription</p>
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
          <p className="text-gray-400">Manage your subscription and billing</p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Subscription Status</h2>
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
            <div className="p-6 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={24} className="text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Plan Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Plan Name</p>
                  <p className="text-white font-semibold text-lg">
                    {userSubscription.plan?.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="text-white font-semibold">
                    ${userSubscription.plan?.price}/{userSubscription.plan?.duration}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{userSubscription.plan?.description}</p>
                </div>
              </div>
            </div>

            {/* Billing Details */}
            <div className="p-6 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={24} className="text-emerald-400" />
                <h3 className="text-xl font-semibold text-white">Billing Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Start Date</p>
                  <p className="text-white font-semibold">
                    {new Date(userSubscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">End Date</p>
                  <p className="text-white font-semibold">
                    {new Date(userSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Days Remaining</p>
                  <p className="text-white font-semibold">{isActive ? daysRemaining : '—'}</p>
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
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Plan Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userSubscription.plan?.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                <span className="text-white">{feature}</span>
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
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Manage Subscription</h2>
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
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Cancel Subscription?</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to cancel your subscription? You will lose access to all
                premium features at the end of your billing period.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition"
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

