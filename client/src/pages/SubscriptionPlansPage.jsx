import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Loader } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchPlans, fetchUserSubscription } from '../store/slices/subscriptionSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import {
  createPaymentOrder,
  displayRazorpay,
  verifyPayment,
  handlePaymentFailure,
} from '../utils/razorpay';

const PlanCard = ({ plan, currentPlanId, onSubscribe, isLoading, processingPayment, isDarkMode }) => {
  const isCurrentPlan = currentPlanId === plan._id;
  const isDisabled = isCurrentPlan || isLoading || processingPayment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className={`backdrop-blur-lg rounded-xl p-8 border transition-all duration-300 relative overflow-hidden ${
        isCurrentPlan
          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
          : isDarkMode
          ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
          : 'bg-white/80 border-gray-200/50 hover:border-gray-300 shadow-lg'
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
          Current Plan
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>{plan.name}</h3>
        <p className={`transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className={`text-5xl font-bold transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>₹{plan.price}</span>
        <span className={`ml-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>/{plan.duration}</span>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <span className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        onClick={() => onSubscribe(plan._id)}
        disabled={isDisabled}
        className={`w-full py-3 px-4 font-bold rounded-lg transition duration-300 ${
          isDisabled
            ? isDarkMode
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-emerald-600 text-white hover:from-blue-600 hover:to-emerald-700'
        }`}
      >
        {processingPayment ? (
          <Loader className="w-6 h-6 animate-spin mx-auto" />
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          'Subscribe Now'
        )}
      </motion.button>
    </motion.div>
  );
};

const SubscriptionPlansPage = () => {
  const dispatch = useDispatch();
  const { plans, userSubscription, isLoading } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useTheme();
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSubscribe = async (planId) => {
    if (processingPayment) return;

    try {
      setProcessingPayment(true);
      toast.loading('Initiating payment...', { id: 'payment-init' });

      // Create payment order (token automatically added by api service)
      const orderResponse = await createPaymentOrder(planId);
      
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      toast.dismiss('payment-init');
      
      // Display Razorpay checkout
      await displayRazorpay(
        orderResponse.order,
        { name: user.name, email: user.email },
        // Success callback
        async (response) => {
          try {
            toast.loading('Verifying payment...', { id: 'payment-verify' });

            // Verify payment (token automatically added by api service)
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: planId,
            });

            toast.dismiss('payment-verify');

            if (verifyResponse.success) {
              toast.success('🎉 Payment successful! Subscription activated.');
              // Refresh subscription data
              dispatch(fetchUserSubscription());
              dispatch(fetchPlans());
            } else {
              throw new Error(verifyResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.message || error.message || 'Payment verification failed');
          } finally {
            setProcessingPayment(false);
          }
        },
        // Failure callback
        async (error) => {
          console.error('Payment failed:', error);
          toast.dismiss('payment-init');
          toast.error('Payment cancelled or failed. Please try again.');
          
          // Log failure to backend (token automatically added by api service)
          await handlePaymentFailure(error);
          setProcessingPayment(false);
        }
      );
    } catch (error) {
      console.error('Subscription error:', error);
      toast.dismiss('payment-init');
      toast.error(error.response?.data?.message || error.message || 'Failed to initiate payment');
      setProcessingPayment(false);
    }
  };

  if (isLoading && plans.length === 0) {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text mb-4">
            Choose Your Plan
          </h1>
          <p className={`text-lg transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Select the perfect subscription plan for your needs
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              currentPlanId={userSubscription?.plan?._id}
              onSubscribe={handleSubscribe}
              isLoading={isLoading}
              processingPayment={processingPayment}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>No subscription plans available</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubscriptionPlansPage;

