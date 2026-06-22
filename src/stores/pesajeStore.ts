import { create } from 'zustand';
import { Pesaje, MotivoPesaje } from '@/types/index';
import { pesajeService, motivoPesajeService } from '@services/pesaje';
import { enqueue } from '@services/offlineQueue';
import { saveCache, loadCache } from '@services/dataCache';
import { useNetworkStore } from './networkStore';

interface PesajeStore {
  pesajes: Pesaje[];
  motivos: MotivoPesaje[];
  isLoading: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  cargarMotivos: () => Promise<void>;
  crear: (data: object) => Promise<void>;
  setError: (error: string | null) => void;
}

export const usePesajeStore = create<PesajeStore>((set) => ({
  pesajes: [],
  motivos: [],
  isLoading: false,
  error: null,

  cargar: async () => {
    if (!useNetworkStore.getState().isOnline) return;
    set({ isLoading: true, error: null });
    try {
      const pesajes = await pesajeService.listar();
      set({ pesajes, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar pesajes', isLoading: false });
    }
  },

  cargarMotivos: async () => {
    if (!useNetworkStore.getState().isOnline) {
      const cached = await loadCache<MotivoPesaje[]>('motivosPesaje');
      if (cached) set({ motivos: cached });
      return;
    }
    try {
      const motivos = await motivoPesajeService.listar();
      set({ motivos });
      await saveCache('motivosPesaje', motivos);
    } catch {}
  },

  crear: async (data: object) => {
    const { isOnline, refreshPendingCount } = useNetworkStore.getState();
    if (!isOnline) {
      await enqueue({ module: 'pesaje', endpoint: '/pesaje', method: 'POST', body: data as Record<string, any> });
      await refreshPendingCount();
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const nuevo = await pesajeService.crear(data);
      set((state) => ({ pesajes: [nuevo, ...state.pesajes], isLoading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al crear pesaje', isLoading: false });
      throw error;
    }
  },

  setError: (error) => set({ error }),
}));
