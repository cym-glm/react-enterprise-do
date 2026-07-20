import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '@/types';

interface AuthStore {
  user: UserInfo | null;
  token: string;
  isLoggedIn: boolean;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  setUser: (user: UserInfo | null) => void;
}

const authStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: '',
      isLoggedIn: false,
      login: (token, user) => set({ token, user, isLoggedIn: true }),
      logout: () => set({ token: '', user: null, isLoggedIn: false }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useAuthStore = () => authStore();

export const getToken = () => authStore.getState().token;
export const logout = () => authStore.getState().logout();

export default useAuthStore;
