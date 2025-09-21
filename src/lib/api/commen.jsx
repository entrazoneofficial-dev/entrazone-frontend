import axiosInstance from "../../axios/axios";


export const commenApi = {
  getNotification: async () => {
  const response = await axiosInstance.get('/v1/unread_notifications/');    
    return response.data;
  },  

  BookaMentor: async (payload) => {
    const response = await axiosInstance.post('/v1/booking-session/', payload);    
    return response.data;
  },

  ScheduleList: async (payload) => {
    const response = await axiosInstance.get('/v1/schedule-list/', payload);    
    return response.data;
  },

  ExamReport: async () => {
    const response = await axiosInstance.get('/v1/exam/report-chart/');    
    return response.data;
  },

ViewDetails: async (payload) => {  
  const response = await axiosInstance.get('/v1/exam/report-details/', { 
    params: payload  
  });       
  return response.data;
},
};