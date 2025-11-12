import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
import SubscriptionPlan from '../models/SubscriptionPlan.model.js';
import UserSubscription from '../models/UserSubscription.model.js';
import { sendSubscriptionEmail } from '../utils/email.utils.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order for subscription
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    console.log('🔐 Create order request from user:', req.user?.email);
    console.log('📦 Plan ID:', req.body.planId);
    
    const { planId } = req.body;
    const userId = req.user._id;

    // Check if plan exists
    const plan = await SubscriptionPlan.findById(planId);

    if (!plan || !plan.isActive) {
      console.error('❌ Plan not found or inactive:', planId);
      return res.status(404).json({
        success: false,
        message: 'Plan not found or inactive',
      });
    }

    console.log('✅ Plan found:', plan.name, '- Price:', plan.price);

    // Check if user already has an active subscription
    const existingSubscription = await UserSubscription.findOne({
      user: userId,
      status: 'active',
    });

    if (existingSubscription) {
      console.log('⚠️ User already has active subscription');
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription. Please cancel it first.',
      });
    }

    // Verify Razorpay is initialized
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay keys not configured');
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured',
      });
    }

    console.log('💳 Creating Razorpay order...');

    // Create Razorpay order
    // Note: Receipt must be max 40 characters
    const receiptId = `rcpt_${Date.now()}`;
    
    const options = {
      amount: Math.round(plan.price * 100), // Razorpay expects amount in paise (smallest currency unit)
      currency: 'INR',
      receipt: receiptId, // Max 40 chars
      notes: {
        planId: plan._id.toString(),
        planName: plan.name,
        userId: userId.toString(),
        userName: req.user.name,
        userEmail: req.user.email,
      },
    };

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created:', order.id);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        planDetails: {
          id: plan._id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
        },
      },
    });
  } catch (error) {
    console.error('❌ Create order error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment order',
    });
  }
};

// @desc    Verify Razorpay payment and create subscription
// @route   POST /api/payments/verify-payment
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment not captured',
      });
    }

    // Get plan details
    const plan = await SubscriptionPlan.findById(planId);

    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found or inactive',
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
      user: req.user._id,
      plan: planId,
      status: 'active',
      startDate,
      endDate,
      paymentInfo: {
        lastPaymentDate: new Date(),
        lastPaymentAmount: plan.price,
        paymentMethod: payment.method,
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id,
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
      message: 'Payment verified and subscription created successfully',
      subscription,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying payment',
    });
  }
};

// @desc    Get Razorpay key for frontend
// @route   GET /api/payments/key
// @access  Public
export const getRazorpayKey = async (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
};

// @desc    Handle payment failure
// @route   POST /api/payments/payment-failed
// @access  Private
export const handlePaymentFailure = async (req, res) => {
  try {
    const { error, orderId } = req.body;

    console.error('Payment failed:', {
      userId: req.user._id,
      userName: req.user.name,
      orderId,
      error,
    });

    res.json({
      success: true,
      message: 'Payment failure logged',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error handling payment failure',
    });
  }
};

// @desc    Create order for subscription renewal
// @route   POST /api/payments/renew-order
// @access  Private
export const createRenewalOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find existing subscription
    const subscription = await UserSubscription.findOne({
      user: userId,
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

    // Create Razorpay order
    // Note: Receipt must be max 40 characters
    const receiptId = `rnw_${Date.now()}`;
    
    const options = {
      amount: Math.round(subscription.plan.price * 100),
      currency: 'INR',
      receipt: receiptId, // Max 40 chars
      notes: {
        subscriptionId: subscription._id.toString(),
        planId: subscription.plan._id.toString(),
        planName: subscription.plan.name,
        userId: userId.toString(),
        userName: req.user.name,
        userEmail: req.user.email,
        type: 'renewal',
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        subscriptionId: subscription._id,
        planDetails: {
          id: subscription.plan._id,
          name: subscription.plan.name,
          description: subscription.plan.description,
          price: subscription.plan.price,
          duration: subscription.plan.duration,
        },
      },
    });
  } catch (error) {
    console.error('Create renewal order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating renewal order',
    });
  }
};

// @desc    Verify renewal payment
// @route   POST /api/payments/verify-renewal
// @access  Private
export const verifyRenewalPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriptionId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Fetch payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment not captured',
      });
    }

    // Get subscription
    const subscription = await UserSubscription.findById(subscriptionId).populate('plan');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
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
      paymentMethod: payment.method,
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id,
    };

    await subscription.save();

    // Send confirmation email
    try {
      await sendSubscriptionEmail(req.user.email, req.user.name, subscription.plan.name);
    } catch (emailError) {
      console.error('Failed to send subscription email:', emailError);
    }

    res.json({
      success: true,
      message: 'Payment verified and subscription renewed successfully',
      subscription,
    });
  } catch (error) {
    console.error('Verify renewal payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying renewal payment',
    });
  }
};

