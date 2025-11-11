import api from './api';

export const getPlans = async () => {
  return await api.get('/subscriptions/plans');
};

export const getUserSubscription = async () => {
  return await api.get('/subscriptions/my-subscription');
};

export const subscribe = async (planId) => {
  return await api.post('/subscriptions/subscribe', { planId });
};

export const cancelSubscription = async () => {
  return await api.post('/subscriptions/cancel');
};

export const renewSubscription = async () => {
  return await api.post('/subscriptions/renew');
};

