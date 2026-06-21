import api from './api';
import { Salida, MotivoSalida } from '@/types/index';

export const salidaService = {
  async listar(): Promise<Salida[]> {
    const response = await api.get<Salida[]>('/salida');
    return response.data;
  },
  async crear(data: object): Promise<Salida> {
    const response = await api.post<Salida>('/salida', data);
    return response.data;
  },
};

export const motivoSalidaService = {
  async listar(): Promise<MotivoSalida[]> {
    const response = await api.get<MotivoSalida[]>('/motivosalida');
    return response.data;
  },
};
