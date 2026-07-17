import axios from '@/utils/axios';
import type { Topic, ApiResponse } from '@/types';

export const getTopics = (params: {
  page?: number;
  limit?: number;
  tab?: string;
}): Promise<ApiResponse<{ data: Topic[]; pagination: { page: number; pageSize: number; total: number } }>> => {
  return axios.get('/topics', { params });
};

export const getTopicDetail = (id: string): Promise<ApiResponse<Topic>> => {
  return axios.get(`/topic/${id}`);
};

export const createTopic = (data: {
  title: string;
  tab: string;
  content: string;
}): Promise<ApiResponse<Topic>> => {
  return axios.post('/topics', data);
};

export const updateTopic = (id: string, data: {
  title?: string;
  tab?: string;
  content?: string;
}): Promise<ApiResponse<Topic>> => {
  return axios.put(`/topics/${id}`, data);
};

export const deleteTopic = (id: string): Promise<ApiResponse<void>> => {
  return axios.delete(`/topics/${id}`);
};
