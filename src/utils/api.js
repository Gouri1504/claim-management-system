import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Backend URL from environment variables
  withCredentials: true, // Allow cookies and credentials
});

// Request Interceptor - Attach Authorization Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle Errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.error('Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('No Response Received:', error.request);
    } else {
      // Something else happened
      console.error('Axios Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
