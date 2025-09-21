import axiosInstance from "../../axios/axios";


export const chapterApi = {
  GetChapters: async (payload) => {
    const response = await axiosInstance.post('/v1/chapter-list/', payload);    
    return response.data;
  },
  GetExamQuestions: async (payload) => {
    const response = await axiosInstance.get('/v1/exam/question-list/', {
      params: payload, 
    });        
    return response.data;
  },

  submitExamAnswers: async (payload) => {
    const response = await axiosInstance.post('/v1/exam/answer-submission/', payload);
    return response.data;
  },
};