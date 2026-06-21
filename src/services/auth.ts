import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, LoginResponse } from '@/types/index';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`,
        credentials
      );

      if (response.data.token) {
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('usuario', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('usuario');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      return null;
    }
  },

  async getStoredUsuario() {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
      return null;
    }
  },

  async refreshToken(): Promise<string | null> {
    try {
      const response = await axios.post<{ token: string }>(
        `${API_BASE_URL}/auth/refresh`
      );
      await AsyncStorage.setItem('auth_token', response.data.token);
      return response.data.token;
    } catch (error) {
      await this.logout();
      return null;
    }
  },

  handleError(error: any) {
    if (axios.isAxiosError(error)) {
      return new Error(
        error.response?.data?.message || error.message || 'Error de autenticación'
      );
    }
    return error;
  },
};
