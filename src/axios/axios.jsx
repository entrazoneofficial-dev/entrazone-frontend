import { backendUrl } from '../constant/BaseUrl';
import { store } from '../Redux/Store';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${backendUrl}/api`,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken; 
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Automatically set Content-Type for FormData
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized error");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;