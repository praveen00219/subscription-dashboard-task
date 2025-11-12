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
import { useTheme } from '../contexts/ThemeContext';

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

const StatCard = ({ icon: Icon, label, value, change, color, isDarkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600' 
        : 'bg-white/80 border-gray-200/50 hover:border-gray-300 shadow-lg'
    }`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-sm mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>{label}</p>
        <h3 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>{value}</h3>
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
  const { isDarkMode } = useTheme();

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
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)',
        bodyColor: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)',
        borderColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)' },
        grid: { color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)' },
      },
      x: {
        ticks: { color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)' },
        grid: { color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)' },
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
          <p className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
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
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={CreditCard}
            label="Active Subscriptions"
            value={stats.activeSubscriptions || 0}
            change="+8% this month"
            color="from-green-500 to-emerald-600"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={Package}
            label="Total Plans"
            value={stats.totalPlans || 0}
            color="from-purple-500 to-purple-600"
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon={DollarSign}
            label="Monthly Revenue"
            value={`$${stats.monthlyRevenue || 0}`}
            change="+15% this month"
            color="from-yellow-500 to-yellow-600"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/80 border-gray-200/50 shadow-lg'
            }`}
          >
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <TrendingUp size={20} className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
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
            className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/80 border-gray-200/50 shadow-lg'
            }`}
          >
            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Activity size={20} className="text-emerald-400" />
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {stats.recentActivity?.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                      : 'bg-gray-100/80 hover:bg-gray-200/80'
                  }`}
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <span className="font-medium">{activity.type}:</span> {activity.description}
                    </p>
                    <p className={`text-xs mt-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )) || (
                <p className={`text-center py-8 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>No recent activity</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Subscription Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/80 border-gray-200/50 shadow-lg'
          }`}
        >
          <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Subscription Status Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm mb-1">Active</p>
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.subscriptionBreakdown?.active || 0}
              </p>
            </div>
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm mb-1">Cancelled</p>
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.subscriptionBreakdown?.cancelled || 0}
              </p>
            </div>
            <div className={`p-4 border rounded-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-700/30 border-gray-600/30' 
                : 'bg-gray-100/80 border-gray-300/30'
            }`}>
              <p className={`text-sm mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Expired</p>
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
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

