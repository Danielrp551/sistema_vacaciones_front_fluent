import { axiosInstance } from '../api/axios';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userName?: string;
  roles?: string[];
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('account/login', payload);
    return data;
  },
  async logout(): Promise<void> {
    // await axiosInstance.post('account/logout');
  }
};
