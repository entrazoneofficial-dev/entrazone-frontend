import axiosInstance from "../../axios/axios";


export const liveClassApi = {
  getLiveClass: async () => {
  const response = await axiosInstance.get('/v1/live-class/');      
    return response.data;
  },  


};