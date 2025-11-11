import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, X, Loader } from 'lucide-react';
import Layout from '../components/Layout';
import {
  fetchAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from '../store/slices/adminSlice';
import toast from 'react-hot-toast';

const PlanFormModal = ({ plan, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    price: plan?.price || '',
    duration: plan?.duration || 'month',
    features: plan?.features?.join('\n') || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const planData = {
      ...formData,
      price: parseFloat(formData.price),
      features: formData.features.split('\n').filter((f) => f.trim()),
    };
    onSubmit(planData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">
            {plan ? 'Edit Plan' : 'Create New Plan'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Plan Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Features (one per line)
            </label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              rows="5"
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-emerald-700 transition"
            >
              {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : 'Save Plan'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminPlansPage = () => {
  const dispatch = useDispatch();
  const { plans, isLoading } = useSelector((state) => state.admin);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPlans());
  }, [dispatch]);

  const handleCreatePlan = async (planData) => {
    try {
      await dispatch(createPlan(planData)).unwrap();
      toast.success('Plan created successfully');
      setShowModal(false);
      dispatch(fetchAllPlans());
    } catch (error) {
      toast.error(error || 'Failed to create plan');
    }
  };

  const handleUpdatePlan = async (planData) => {
    try {
      await dispatch(updatePlan({ id: editingPlan._id, planData })).unwrap();
      toast.success('Plan updated successfully');
      setShowModal(false);
      setEditingPlan(null);
      dispatch(fetchAllPlans());
    } catch (error) {
      toast.error(error || 'Failed to update plan');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      await dispatch(deletePlan(id)).unwrap();
      toast.success('Plan deleted successfully');
      dispatch(fetchAllPlans());
    } catch (error) {
      toast.error(error || 'Failed to delete plan');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text mb-2">
              Manage Plans
            </h1>
            <p className="text-gray-400">Create and manage subscription plans</p>
          </div>
          <button
            onClick={() => {
              setEditingPlan(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-emerald-700 transition"
          >
            <Plus size={20} />
            Create Plan
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400 ml-2">/{plan.duration}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features?.map((feature, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingPlan(plan);
                    setShowModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePlan(plan._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {plans.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No plans available. Create one to get started!</p>
          </div>
        )}

        {/* Plan Form Modal */}
        {showModal && (
          <PlanFormModal
            plan={editingPlan}
            onClose={() => {
              setShowModal(false);
              setEditingPlan(null);
            }}
            onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
            isLoading={isLoading}
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminPlansPage;

