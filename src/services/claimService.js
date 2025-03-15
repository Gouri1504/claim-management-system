import axios from 'axios';
import { getAuthToken } from './authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const instance = axios.create({ baseURL: API_URL });

instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const submitClaim = async (claimData) => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    return {
      ...claimData,
      id: Date.now().toString(),
      status: 'pending',
      submissionDate: new Date().toISOString()
    };
  }

  const formData = new FormData();
  Object.keys(claimData).forEach((key) => {
    if (key !== 'file') {
      formData.append(key, claimData[key]);
    }
  });

  if (claimData.file) {
    claimData.file.forEach((file) => {
      formData.append('file', file);
    });
  }

  try {
    const response = await instance.post('/claims', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaims = async (filters = {}) => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    return [];
  }

  try {
    const response = await instance.get('/claims', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClaimStatus = async (claimId, updateData) => {
  try {
    const response = await instance.put(`/claims/${claimId}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaimById = async (claimId) => {
  try {
    const response = await instance.get(`/claims/${claimId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
