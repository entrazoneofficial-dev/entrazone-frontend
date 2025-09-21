import axiosInstance from "../../axios/axios";




export const homeApi = {
  fetchHomeData:  async () => {
        try {
            const response = await axiosInstance.get('/v1/home/');                                                 
            return response.data;
        } catch (error) {
            console.error('Error fetching window series:', error);
            throw error;
        }
    },

    dailyTaskData: async (params = {}) => {
        const response = await axiosInstance.get('/v1/schedule-list/', { params });
        return response.data;
    },
};