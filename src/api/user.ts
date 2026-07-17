import axios from '@/utils/axios';
import type { UserInfo, ApiResponse } from '@/types';

export const getUserInfo = (loginname: string): Promise<ApiResponse<UserInfo>> => {
  return axios.get(`/user/${loginname}`);
};

export const getUsers = (page: number = 1, limit: number = 20): Promise<ApiResponse<UserInfo[]>> => {
  return axios.get('/users', {
    params: { page, limit },
  });
};
