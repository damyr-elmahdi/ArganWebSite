import axios from 'axios';

// In Vite, use import.meta.env instead of process.env
// If we're using a proxy in development, we can just use relative URLs
axios.defaults.baseURL = '/';  // This will work with the Vite proxy configuration

// Initialize token from localStorage if available
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add request interceptor to handle errors
axios.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page only if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;