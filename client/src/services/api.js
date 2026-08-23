import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('flashmenu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('flashmenu_token');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  verifyAdmin2FA: (data) => API.post('/auth/verify-admin-2fa', data),
};

export const restaurantAPI = {
  getMyRestaurant: () => API.get('/restaurants/my-restaurant'),
  updateMyRestaurant: (data) => API.put('/restaurants/my-restaurant', data),
};

export const paymentAPI = {
  createOrder: (data) => API.post('/payment/create-order', data),
  verifyPayment: (data) => API.post('/payment/verify-payment', data),
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
  reorder: (items) => API.put('/categories/reorder', { items }),
};

export const itemAPI = {
  getAll: (categoryId) => API.get('/items', { params: { categoryId } }),
  create: (data) => API.post('/items', data),
  update: (id, data) => API.put(`/items/${id}`, data),
  toggleAvailability: (id) => API.patch(`/items/${id}/toggle-available`),
  duplicate: (id) => API.post(`/items/${id}/duplicate`),
  delete: (id) => API.delete(`/items/${id}`),
  reorder: (items) => API.put('/items/reorder', { items }),
};

export const analyticsAPI = {
  getOverview: () => API.get('/analytics/overview'),
  resolveWaiterCall: (id) => API.patch(`/analytics/waiter-call/${id}/resolve`),
  getFeedback: () => API.get('/analytics/feedback'),
};

export const orderAPI = {
  getOrders: () => API.get('/orders'),
  getOrderHistory: () => API.get('/orders/history'),
  updateStatus: (id, status) => API.patch(`/orders/${id}/status`, { status }),
};

export const publicAPI = {
  getMenu: (slug, table) => API.get(`/public/menu/${slug}`, { params: { table } }),
  callWaiter: (data) => API.post('/public/call-waiter', data),
  submitFeedback: (data) => API.post('/public/feedback', data),
  createOrder: (data) => API.post('/public/order', data),
};

export const uploadAPI = {
  uploadImage: (formData) =>
    API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const adminAPI = {
  getRestaurants: () => API.get('/admin/restaurants'),
  updatePlan: (id, subscriptionPlan, secretCode) =>
    API.put(`/admin/restaurants/${id}/plan`, { subscriptionPlan, secretCode, adminPassword: secretCode }),
  toggleStatus: (id, secretCode) =>
    API.put(`/admin/restaurants/${id}/status`, { secretCode, adminPassword: secretCode }),
  deleteRestaurant: (id) => API.delete(`/admin/restaurants/${id}`),
  createOwner: (data) => API.post('/admin/create-owner', data),
};

export default API;
