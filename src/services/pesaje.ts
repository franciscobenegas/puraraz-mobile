import api from './api';
import { Pesaje, MotivoPesaje } from '@/types/index';

export const pesajeService = {
  async listar(): Promise<Pesaje[]> {
    const response = await api.get<Pesaje[]>('/pesaje');
    return response.data;
  },
  async crear(data: object): Promise<Pesaje> {
    const response = await api.post<Pesaje>('/pesaje', data);
    return response.data;
  },
};

export const motivoPesajeService = {
  async listar(): Promise<MotivoPesaje[]> {
    const response = await api.get<MotivoPesaje[]>('/motivopesaje');
    return response.data;
  },
};
