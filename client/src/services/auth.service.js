import api from './api';

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
  return response;
};

export const verifyEmail = async (code) => {
  const response = await api.post('/auth/verify-email', { code });
  return response;
};

export const checkAuth = async () => {
  return await api.get('/auth/check-auth');
};

export const forgotPassword = async (email) => {
  return await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token, password) => {
  return await api.post(`/auth/reset-password/${token}`, { password });
};

