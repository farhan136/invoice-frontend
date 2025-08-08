import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// The base URL of your API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config: any) => {
    // You can get the token from localStorage, cookies, etc.
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic function to handle API requests
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    // You can add more robust error handling here
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
    throw new Error('An unexpected error occurred');
  }
};