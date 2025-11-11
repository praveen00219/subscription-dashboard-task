import express from 'express';
import {
  getPlans,
  getUserSubscription,
  subscribe,
  cancelSubscription,
  renewSubscription,
  getSubscriptionHistory,
} from '../controllers/subscription.controller.js';
import { protect, verifyEmail } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.get('/my-subscription', protect, getUserSubscription);
router.post('/subscribe', protect, verifyEmail, subscribe);
router.post('/cancel', protect, cancelSubscription);
router.post('/renew', protect, verifyEmail, renewSubscription);
router.get('/history', protect, getSubscriptionHistory);

export default router;

