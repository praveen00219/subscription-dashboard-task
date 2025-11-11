import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  Users,
  Package,
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
} from 'lucide-react';
import Layout from '../components/Layout';
import { fetchDashboardStats } from '../store/slices/adminSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ icon: Icon, label, value, change, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-2">{label}</p>
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
        {change && (
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-green-400">{change}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { dashboardStats, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading && !dashboardStats) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const stats = dashboardStats || {};
  const growth = stats.userGrowth || [];

  // Chart data
  const chartData = {
    labels: growth.map((d) =>
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'New Users',
        data: growth.map((d) => d.count),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(156, 163, 175)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(75, 85, 99, 0.3)' },
      },
      x: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(75, 85, 99, 0.3)' },
      },
    },
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Overview of subscription management system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers || 0}
            change="+12% this month"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={CreditCard}
            label="Active Subscriptions"
            value={stats.activeSubscriptions || 0}
            change="+8% this month"
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            icon={Package}
            label="Total Plans"
            value={stats.totalPlans || 0}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={DollarSign}
            label="Monthly Revenue"
            value={`$${stats.monthlyRevenue || 0}`}
            change="+15% this month"
            color="from-yellow-500 to-yellow-600"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-400" />
              User Growth (Last 7 Days)
            </h3>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-emerald-400" />
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {stats.recentActivity?.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.type}:</span> {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-400 text-center py-8">No recent activity</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Subscription Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4">Subscription Status Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm mb-1">Active</p>
              <p className="text-2xl font-bold text-white">
                {stats.subscriptionBreakdown?.active || 0}
              </p>
            </div>
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-white">
                {stats.subscriptionBreakdown?.cancelled || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-700/30 border border-gray-600/30 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Expired</p>
              <p className="text-2xl font-bold text-white">
                {stats.subscriptionBreakdown?.expired || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;

