import api from './api';

export const getDashboardStats = async () => {
  return await api.get('/admin/dashboard-stats');
};

export const getAllUsers = async () => {
  return await api.get('/admin/users');
};

export const getAllPlans = async () => {
  return await api.get('/admin/plans');
};

export const createPlan = async (planData) => {
  return await api.post('/admin/plans', planData);
};

export const updatePlan = async (id, planData) => {
  return await api.put(`/admin/plans/${id}`, planData);
};

export const deletePlan = async (id) => {
  return await api.delete(`/admin/plans/${id}`);
};

export const updateUserRole = async (userId, role) => {
  return await api.put(`/admin/users/${userId}/role`, { role });
};

