import axiosInstance from "../../axios/axios";


export const authApi = {

  login: async (payload) => {
    const response = await axiosInstance.post('/v1/otp-auth/', payload);    
    
    return response.data;
  },

  register: async (payload) => {
    const response = await axiosInstance.post('/v1/register/', payload);
    return response.data;
  },

  verifyOtp: async (payload) => {
    const response = await axiosInstance.post('/v1/signup-otp-auth/', payload);
    return response.data;
  },

  LoginverifyOtp: async (payload) => {
    const response = await axiosInstance.post('/v1/otp-login-verify/', payload);
    return response.data;
  },



  getCourses: async () => {
        try {
            const response = await axiosInstance.get('/v1/course-list/');             
            return response.data;
        } catch (error) {
            console.error('Error fetching window series:', error);
            throw error;
        }
    },

  selectedCourse: async (payload) => {
  const response = await axiosInstance.get('/v1/course-select/', {
    params: payload, 
  });    
    return response.data;
  },  

  logout: async () => {
    const response = await axiosInstance.post('/v1/logout/');
    return response.data;
  },

};