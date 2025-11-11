import SubscriptionPlan from '../models/SubscriptionPlan.model.js';
import UserSubscription from '../models/UserSubscription.model.js';
import { sendSubscriptionEmail } from '../utils/email.utils.js';

// @desc    Get all active subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
export const getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });

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

// @desc    Get user's subscription
// @route   GET /api/subscriptions/my-subscription
// @access  Private
export const getUserSubscription = async (req, res) => {
  try {
    const subscription = await UserSubscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'cancelled'] },
    })
      .populate('plan')
      .sort({ createdAt: -1 });

    if (!subscription) {
      return res.json({
        success: true,
        subscription: null,
      });
    }

    // Update status if expired
    if (subscription.isExpired && subscription.status === 'active') {
      subscription.status = 'expired';
      await subscription.save();
    }

    res.json({
      success: true,
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching subscription',
    });
  }
};

// @desc    Subscribe to a plan
// @route   POST /api/subscriptions/subscribe
// @access  Private
export const subscribe = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    // Check if plan exists
    const plan = await SubscriptionPlan.findById(planId);

    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found or inactive',
      });
    }

    // Check if user already has an active subscription
    const existingSubscription = await UserSubscription.findOne({
      user: userId,
      status: 'active',
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription. Please cancel it first.',
      });
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    if (plan.duration === 'year') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Create subscription
    const subscription = await UserSubscription.create({
      user: userId,
      plan: planId,
      status: 'active',
      startDate,
      endDate,
      paymentInfo: {
        lastPaymentDate: new Date(),
        lastPaymentAmount: plan.price,
        paymentMethod: 'credit_card', // This would come from payment gateway
        transactionId: `TXN-${Date.now()}`, // This would come from payment gateway
      },
    });

    // Populate plan details
    await subscription.populate('plan');

    // Send confirmation email
    try {
      await sendSubscriptionEmail(req.user.email, req.user.name, plan.name);
    } catch (emailError) {
      console.error('Failed to send subscription email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating subscription',
    });
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
// @access  Private
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await UserSubscription.findOne({
      user: req.user._id,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = Date.now();
    subscription.autoRenew = false;
    await subscription.save();

    await subscription.populate('plan');

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling subscription',
    });
  }
};

// @desc    Renew subscription
// @route   POST /api/subscriptions/renew
// @access  Private
export const renewSubscription = async (req, res) => {
  try {
    const subscription = await UserSubscription.findOne({
      user: req.user._id,
      status: { $in: ['cancelled', 'expired'] },
    }).populate('plan');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No subscription found to renew',
      });
    }

    // Check if plan is still active
    if (!subscription.plan.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This plan is no longer available',
      });
    }

    // Update subscription
    const startDate = new Date();
    const endDate = new Date();
    if (subscription.plan.duration === 'year') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    subscription.status = 'active';
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    subscription.cancelledAt = undefined;
    subscription.autoRenew = true;
    subscription.paymentInfo = {
      lastPaymentDate: new Date(),
      lastPaymentAmount: subscription.plan.price,
      paymentMethod: 'credit_card',
      transactionId: `TXN-${Date.now()}`,
    };

    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription renewed successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error renewing subscription',
    });
  }
};

// @desc    Get subscription history
// @route   GET /api/subscriptions/history
// @access  Private
export const getSubscriptionHistory = async (req, res) => {
  try {
    const subscriptions = await UserSubscription.find({
      user: req.user._id,
    })
      .populate('plan')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching subscription history',
    });
  }
};

