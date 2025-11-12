import express from 'express';
import {
  createOrder,
  verifyPayment,
  getRazorpayKey,
  handlePaymentFailure,
  createRenewalOrder,
  verifyRenewalPayment,
} from '../controllers/payment.controller.js';
import { protect, verifyEmail } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/key', getRazorpayKey);

// Protected routes
router.post('/create-order', protect, verifyEmail, createOrder);
router.post('/verify-payment', protect, verifyEmail, verifyPayment);
router.post('/payment-failed', protect, handlePaymentFailure);
router.post('/renew-order', protect, verifyEmail, createRenewalOrder);
router.post('/verify-renewal', protect, verifyEmail, verifyRenewalPayment);

export default router;

