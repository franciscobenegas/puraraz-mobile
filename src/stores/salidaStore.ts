import { create } from 'zustand';
import { Salida, MotivoSalida } from '@/types/index';
import { salidaService, motivoSalidaService } from '@services/salida';

interface SalidaStore {
  salidas: Salida[];
  motivos: MotivoSalida[];
  isLoading: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  cargarMotivos: () => Promise<void>;
  crear: (data: object) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useSalidaStore = create<SalidaStore>((set) => ({
  salidas: [],
  motivos: [],
  isLoading: false,
  error: null,

  cargar: async () => {
    set({ isLoading: true, error: null });
    try {
      const salidas = await salidaService.listar();
      set({ salidas, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar salidas', isLoading: false });
    }
  },

  cargarMotivos: async () => {
    try {
      const motivos = await motivoSalidaService.listar();
      set({ motivos });
    } catch {}
  },

  crear: async (data: object) => {
    set({ isLoading: true, error: null });
    try {
      await salidaService.crear(data);
      const salidas = await salidaService.listar();
      set({ salidas, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al crear salida', isLoading: false });
      throw error;
    }
  },

  setError: (error) => set({ error }),
}));
