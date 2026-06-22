import { create } from 'zustand';
import { Entrada, MotivoEntrada } from '@/types/index';
import { entradaService, motivoEntradaService } from '@services/entrada';
import { enqueue } from '@services/offlineQueue';
import { saveCache, loadCache } from '@services/dataCache';
import { useNetworkStore } from './networkStore';

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
    if (!useNetworkStore.getState().isOnline) return;
    set({ isLoading: true, error: null });
    try {
      const entradas = await entradaService.listar();
      set({ entradas, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar entradas', isLoading: false });
    }
  },

  cargarMotivos: async () => {
    if (!useNetworkStore.getState().isOnline) {
      const cached = await loadCache<MotivoEntrada[]>('motivosEntrada');
      if (cached) set({ motivos: cached });
      return;
    }
    try {
      const motivos = await motivoEntradaService.listar();
      set({ motivos });
      await saveCache('motivosEntrada', motivos);
    } catch {}
  },

  crear: async (data: object) => {
    const { isOnline, refreshPendingCount } = useNetworkStore.getState();
    if (!isOnline) {
      await enqueue({ module: 'entrada', endpoint: '/entrada', method: 'POST', body: data as Record<string, any> });
      await refreshPendingCount();
      return;
    }
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
