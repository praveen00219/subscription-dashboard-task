import User from '../models/User.model.js';
import SubscriptionPlan from '../models/SubscriptionPlan.model.js';
import UserSubscription from '../models/UserSubscription.model.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();

    // Get active subscriptions
    const activeSubscriptions = await UserSubscription.countDocuments({ status: 'active' });

    // Get total plans
    const totalPlans = await SubscriptionPlan.countDocuments({ isActive: true });

    // Calculate monthly revenue (sum of active subscription prices)
    const activeSubscriptionsList = await UserSubscription.find({ status: 'active' }).populate('plan');
    const monthlyRevenue = activeSubscriptionsList.reduce((total, sub) => {
      if (sub.plan.duration === 'month') {
        return total + sub.plan.price;
      } else {
        return total + (sub.plan.price / 12); // Convert yearly to monthly
      }
    }, 0);

    // Get user growth for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userGrowth = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate },
      });

      userGrowth.push({
        date: date.toISOString(),
        count,
      });
    }

    // Get subscription breakdown
    const subscriptionBreakdown = {
      active: await UserSubscription.countDocuments({ status: 'active' }),
      cancelled: await UserSubscription.countDocuments({ status: 'cancelled' }),
      expired: await UserSubscription.countDocuments({ status: 'expired' }),
    };

    // Get recent activity
    const recentSubscriptions = await UserSubscription.find()
      .populate('user', 'name email')
      .populate('plan', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentActivity = recentSubscriptions.map((sub) => ({
      type: 'Subscription',
      description: `${sub.user.name} subscribed to ${sub.plan.name}`,
      timestamp: sub.createdAt,
    }));

    res.json({
      success: true,
      totalUsers,
      activeSubscriptions,
      totalPlans,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      userGrowth,
      subscriptionBreakdown,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching dashboard stats',
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    // Get all users without trying to populate subscription (it's not in the User schema)
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    // Manually populate subscription for each user from UserSubscription collection
    const usersWithSubscriptions = await Promise.all(
      users.map(async (user) => {
        const subscription = await UserSubscription.findOne({
          user: user._id,
          status: { $in: ['active', 'cancelled'] },
        })
          .populate('plan')
          .sort({ createdAt: -1 });

        return {
          ...user.toObject(),
          subscription,
        };
      })
    );

    res.json({
      success: true,
      users: usersWithSubscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users',
    });
  }
};

// @desc    Get all subscription plans (including inactive)
// @route   GET /api/admin/plans
// @access  Private/Admin
export const getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ price: 1 });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching plans',
    });
  }
};

// @desc    Create a new subscription plan
// @route   POST /api/admin/plans
// @access  Private/Admin
export const createPlan = async (req, res) => {
  try {
    const { name, description, price, duration, features, maxUsers, trialDays } = req.body;

    // Check if plan with same name exists
    const existingPlan = await SubscriptionPlan.findOne({ name });

    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: 'Plan with this name already exists',
      });
    }

    const plan = await SubscriptionPlan.create({
      name,
      description,
      price,
      duration,
      features,
      maxUsers,
      trialDays,
    });

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating plan',
    });
  }
};

// @desc    Update a subscription plan
// @route   PUT /api/admin/plans/:id
// @access  Private/Admin
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const plan = await SubscriptionPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Update plan
    Object.assign(plan, updateData);
    await plan.save();

    res.json({
      success: true,
      message: 'Plan updated successfully',
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating plan',
    });
  }
};

// @desc    Delete a subscription plan
// @route   DELETE /api/admin/plans/:id
// @access  Private/Admin
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await SubscriptionPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Check if any active subscriptions use this plan
    const activeSubscriptions = await UserSubscription.countDocuments({
      plan: id,
      status: 'active',
    });

    if (activeSubscriptions > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete plan. ${activeSubscriptions} active subscription(s) are using this plan.`,
      });
    }

    await SubscriptionPlan.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting plan',
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user role',
    });
  }
};

// @desc    Get all subscriptions
// @route   GET /api/admin/subscriptions
// @access  Private/Admin
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await UserSubscription.find()
      .populate('user', 'name email')
      .populate('plan')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching subscriptions',
    });
  }
};

