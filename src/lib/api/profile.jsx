import axiosInstance from "../../axios/axios";

export const ProfileApi = {

profileEdit: async (payload) => {
    const response = await axiosInstance.put('/v1/update-profile/', payload);    
    return response.data;
  },

};