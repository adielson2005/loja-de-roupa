import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Store Config
export const getStoreConfig = () => api.get('/store');
export const updateStoreConfig = (data) => api.put('/store', data);

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const toggleProductFeatured = (id) => api.patch(`/products/${id}/featured`);
export const toggleProductActive = (id) => api.patch(`/products/${id}/active`);

// Orders
export const getOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });

// Auth
export const loginAdmin = (credentials) => api.post('/auth/login', credentials);
export const verifyToken = () => api.get('/auth/verify');

// Promotions
export const getPromotions = () => api.get('/promotions');
export const createPromotion = (data) => api.post('/promotions', data);
export const updatePromotion = (id, data) => api.put(`/promotions/${id}`, data);
export const deletePromotion = (id) => api.delete(`/promotions/${id}`);
export const togglePromotionActive = (id) => api.patch(`/promotions/${id}/active`);
export const validateCoupon = (code, subtotal) => api.get(`/promotions/validate/${code}`, { params: { subtotal } });

// Upload
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Dashboard Stats
export const getDashboardStats = () => api.get('/dashboard/stats');

export default api;
