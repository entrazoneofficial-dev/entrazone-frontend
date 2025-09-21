import axiosInstance from "../../axios/axios";


export const lessonApi = {
  getLesson: async (payload) => {
  const response = await axiosInstance.get('/v1/lesson-list/', {
    params: payload, 
  });    
    return response.data;
  },  

  getFolder: async (payload) => {
  const response = await axiosInstance.get('/v1/folder/', {
    params: payload, 
  });    
    return response.data;
  },  

};