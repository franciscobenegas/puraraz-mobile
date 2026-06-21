import api from './api';
import {
  Mortandad,
  Categoria,
  CausaMortandad,
  Potrero,
  Propietario,
} from '@/types/index';

export const mortandadService = {
  async crear(data: FormData): Promise<Mortandad> {
    try {
      const response = await api.post<Mortandad>('/mortandad', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async listar(): Promise<Mortandad[]> {
    try {
      const response = await api.get<Mortandad[]>('/mortandad');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async obtener(id: string): Promise<Mortandad> {
    try {
      const response = await api.get<Mortandad>(`/mortandad/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async actualizar(id: string, data: FormData): Promise<Mortandad> {
    try {
      const response = await api.put<Mortandad>(`/mortandad/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async eliminar(id: string): Promise<void> {
    try {
      await api.delete(`/mortandad/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error: any) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return error;
  },
};

export const categoriaService = {
  async listar(): Promise<Categoria[]> {
    try {
      const response = await api.get<Categoria[]>('/categoria');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener categorías');
    }
  },
};

export const causaMortandadService = {
  async listar(): Promise<CausaMortandad[]> {
    try {
      const response = await api.get<CausaMortandad[]>('/causamortandad');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener causas de mortandad');
    }
  },
};

export const potreroService = {
  async listar(): Promise<Potrero[]> {
    try {
      const response = await api.get<Potrero[]>('/potrero');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener potreros');
    }
  },
};

export const propietarioService = {
  async listar(): Promise<Propietario[]> {
    try {
      const response = await api.get<Propietario[]>('/propietario');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener propietarios');
    }
  },
};
