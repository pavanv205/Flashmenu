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

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
};

export const restaurantAPI = {
  getMyRestaurant: () => API.get('/restaurants/my-restaurant'),
  updateMyRestaurant: (data) => API.put('/restaurants/my-restaurant', data),
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
  updatePlan: (id, subscriptionPlan) => API.put(`/admin/restaurants/${id}/plan`, { subscriptionPlan }),
  toggleStatus: (id) => API.put(`/admin/restaurants/${id}/status`),
  deleteRestaurant: (id) => API.delete(`/admin/restaurants/${id}`),
};

export default API;
