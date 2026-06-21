import api from './api';
import { Entrada, MotivoEntrada } from '@/types/index';

export const entradaService = {
  async listar(): Promise<Entrada[]> {
    const response = await api.get<Entrada[]>('/entrada');
    return response.data;
  },
  async crear(data: object): Promise<Entrada> {
    const response = await api.post<Entrada>('/entrada', data);
    return response.data;
  },
};

export const motivoEntradaService = {
  async listar(): Promise<MotivoEntrada[]> {
    const response = await api.get<MotivoEntrada[]>('/motivoentrada');
    return response.data;
  },
};
