import express from 'express';
import {
  signup,
  login,
  logout,
  verifyEmailCode,
  checkAuth,
  forgotPassword,
  resetPassword,
  refreshToken,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmailCode);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.post('/logout', protect, logout);
router.get('/check-auth', protect, checkAuth);

export default router;

