export interface UserInfo {
  id: string;
  loginname: string;
  avatar_url: string;
  url: string;
  score: number;
  create_at: string;
}

export interface Topic {
  id: string;
  author_id: string;
  tab: string;
  content: string;
  title: string;
  last_reply_at: string;
  good: boolean;
  top: boolean;
  reply_count: number;
  visit_count: number;
  create_at: string;
  author: UserInfo;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  author: UserInfo;
  content: string;
  ups: string[];
  create_at: string;
  reply_id?: string;
}

export interface LoginState {
  user: UserInfo | null;
  token: string;
  isLoggedIn: boolean;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error_msg?: string;
}
