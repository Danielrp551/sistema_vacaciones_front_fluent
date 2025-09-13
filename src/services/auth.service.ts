import { axiosInstance } from '../api/axios';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userName?: string;
  roles?: string[];
  permisos?: string[];
}

export interface CurrentUserResponse {
  id: string;
  userName: string;
  email: string;
  persona: {
    id: string;
    dni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    fechaIngreso: string;
    salario: number;
    userId: string;
  };
  roles: string[];
  permisos: string[];
  isActive: boolean;
  lastLoginDate?: string;
}

export const AuthService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('account/login', payload);
    return data;
  },
  
  async getCurrentUser(): Promise<CurrentUserResponse> {
    const { data } = await axiosInstance.get<CurrentUserResponse>('account/me');
    return data;
  },
  
  async logout(): Promise<void> {
    // await axiosInstance.post('account/logout');
  }
};
