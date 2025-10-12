// Simple auth state management
const AUTH_TOKEN_KEY = 'saathi_auth_token';
const USER_DATA_KEY = 'saathi_user_data';

export interface UserData {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  type: 'user' | 'doctor' | 'hospital';
}

export const authStorage = {
  setToken: (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setUserData: (data: UserData) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  },

  getUserData: (): UserData | null => {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearAuth: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};
