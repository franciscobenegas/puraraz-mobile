import { create } from 'zustand';
import { Entrada, MotivoEntrada } from '@/types/index';
import { entradaService, motivoEntradaService } from '@services/entrada';

interface EntradaStore {
  entradas: Entrada[];
  motivos: MotivoEntrada[];
  isLoading: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  cargarMotivos: () => Promise<void>;
  crear: (data: object) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useEntradaStore = create<EntradaStore>((set) => ({
  entradas: [],
  motivos: [],
  isLoading: false,
  error: null,

  cargar: async () => {
    set({ isLoading: true, error: null });
    try {
      const entradas = await entradaService.listar();
      set({ entradas, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar entradas', isLoading: false });
    }
  },

  cargarMotivos: async () => {
    try {
      const motivos = await motivoEntradaService.listar();
      set({ motivos });
    } catch {}
  },

  crear: async (data: object) => {
    set({ isLoading: true, error: null });
    try {
      await entradaService.crear(data);
      const entradas = await entradaService.listar();
      set({ entradas, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al crear entrada', isLoading: false });
      throw error;
    }
  },

  setError: (error) => set({ error }),
}));
