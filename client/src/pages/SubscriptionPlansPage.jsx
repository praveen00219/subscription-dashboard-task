import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Loader } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchPlans, subscribeToPlan } from '../store/slices/subscriptionSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PlanCard = ({ plan, currentPlanId, onSubscribe, isLoading }) => {
  const isCurrentPlan = currentPlanId === plan._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border ${
        isCurrentPlan
          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
          : 'border-gray-700/50'
      } hover:border-gray-600 transition-all relative overflow-hidden`}
    >
      {isCurrentPlan && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
          Current Plan
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-gray-400">{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-5xl font-bold text-white">${plan.price}</span>
        <span className="text-gray-400 ml-2">/{plan.duration}</span>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSubscribe(plan._id)}
        disabled={isCurrentPlan || isLoading}
        className={`w-full py-3 px-4 font-bold rounded-lg transition ${
          isCurrentPlan
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-emerald-600 text-white hover:from-blue-600 hover:to-emerald-700'
        }`}
      >
        {isLoading ? (
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

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSubscribe = async (planId) => {
    try {
      await dispatch(subscribeToPlan(planId)).unwrap();
      toast.success('Successfully subscribed to plan!');
    } catch (error) {
      toast.error(error || 'Failed to subscribe');
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
          <p className="text-gray-400 text-lg">
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
            />
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No subscription plans available</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubscriptionPlansPage;

