import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  updateUserRole,
  getAllSubscriptions,
} from '../controllers/admin.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect, admin);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

// Plans
router.get('/plans', getAllPlans);
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

// Subscriptions
router.get('/subscriptions', getAllSubscriptions);

export default router;

