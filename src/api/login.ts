import axios from '@/utils/axios';
import type { ApiResponse } from '@/types';

export interface LoginParams {
  accesstoken: string;
}

export const login = (params: LoginParams): Promise<ApiResponse<{ loginname: string; avatar_url: string; id: string; url: string; score: number; create_at: string }>> => {
  return axios.post('/accesstoken', params);
};
