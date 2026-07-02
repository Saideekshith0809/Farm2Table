// API Service for Farm2Table
// This file contains all API calls to the backend

const API_BASE_URL = 'http://192.168.29.87:5000/api'; // Use IP address for mobile connectivity

// Helper function to make API requests
const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication APIs
export const loginUser = async (email, password) => {
  return apiRequest('/auth/login', 'POST', { email, password });
};

export const registerUser = async (userData) => {
  return apiRequest('/auth/register', 'POST', userData);
};

export const logoutUser = async (token) => {
  return apiRequest('/auth/logout', 'POST', null, token);
};

// Product APIs
export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return apiRequest(`/products?${queryParams}`);
};

export const getProductById = async (productId) => {
  return apiRequest(`/products/${productId}`);
};

export const createProduct = async (productData, token) => {
  return apiRequest('/products', 'POST', productData, token);
};

export const updateProduct = async (productId, productData, token) => {
  return apiRequest(`/products/${productId}`, 'PUT', productData, token);
};

export const deleteProduct = async (productId, token) => {
  return apiRequest(`/products/${productId}`, 'DELETE', null, token);
};

// Cart APIs
export const getCart = async (token) => {
  return apiRequest('/cart', 'GET', null, token);
};

export const addToCart = async (productId, quantity, token) => {
  return apiRequest('/cart', 'POST', { productId, quantity }, token);
};

export const updateCartItem = async (itemId, quantity, token) => {
  return apiRequest(`/cart/${itemId}`, 'PUT', { quantity }, token);
};

export const removeFromCart = async (itemId, token) => {
  return apiRequest(`/cart/${itemId}`, 'DELETE', null, token);
};

// Order APIs
export const getOrders = async (token) => {
  return apiRequest('/orders', 'GET', null, token);
};

export const getOrderById = async (orderId, token) => {
  return apiRequest(`/orders/${orderId}`, 'GET', null, token);
};

export const createOrder = async (orderData, token) => {
  return apiRequest('/orders', 'POST', orderData, token);
};

export const updateOrderStatus = async (orderId, status, token) => {
  return apiRequest(`/orders/${orderId}/status`, 'PUT', { status }, token);
};

// Farmer APIs
export const getFarmerProfile = async (farmerId) => {
  return apiRequest(`/farmers/${farmerId}`);
};

export const updateFarmerProfile = async (profileData, token) => {
  return apiRequest('/farmers/profile', 'PUT', profileData, token);
};

export const getFarmerDashboard = async (token) => {
  return apiRequest('/farmers/dashboard', 'GET', null, token);
};

// User APIs
export const getUserProfile = async (token) => {
  return apiRequest('/users/profile', 'GET', null, token);
};

export const updateUserProfile = async (profileData, token) => {
  return apiRequest('/users/profile', 'PUT', profileData, token);
};

// Search APIs
export const searchProducts = async (query) => {
  return apiRequest(`/search?q=${encodeURIComponent(query)}`);
};

export const searchFarmers = async (query) => {
  return apiRequest(`/search/farmers?q=${encodeURIComponent(query)}`);
};

// Rating APIs
export const rateProduct = async (productId, rating, review, token) => {
  return apiRequest(`/products/${productId}/rate`, 'POST', { rating, review }, token);
};

export const rateFarmer = async (farmerId, rating, review, token) => {
  return apiRequest(`/farmers/${farmerId}/rate`, 'POST', { rating, review }, token);
};

// Location APIs
export const getNearbyFarmers = async (latitude, longitude, radius = 50) => {
  return apiRequest(`/farmers/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getFarmerProfile,
  updateFarmerProfile,
  getFarmerDashboard,
  getUserProfile,
  updateUserProfile,
  searchProducts,
  searchFarmers,
  rateProduct,
  rateFarmer,
  getNearbyFarmers,
};
