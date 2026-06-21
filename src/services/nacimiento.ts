import api from './api';
import { Nacimiento } from '@/types/index';

export const nacimientoService = {
  async listar(): Promise<Nacimiento[]> {
    const response = await api.get<Nacimiento[]>('/nacimiento');
    return response.data;
  },
  async crear(data: object): Promise<Nacimiento> {
    const response = await api.post<Nacimiento>('/nacimiento', data);
    return response.data;
  },
  async eliminar(id: string): Promise<void> {
    await api.delete(`/nacimiento/${id}`);
  },
};
