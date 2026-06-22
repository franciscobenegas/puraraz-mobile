import { create } from 'zustand';
import { Salida, MotivoSalida } from '@/types/index';
import { salidaService, motivoSalidaService } from '@services/salida';
import { enqueue } from '@services/offlineQueue';
import { saveCache, loadCache } from '@services/dataCache';
import { useNetworkStore } from './networkStore';

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
    if (!useNetworkStore.getState().isOnline) return;
    set({ isLoading: true, error: null });
    try {
      const salidas = await salidaService.listar();
      set({ salidas, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar salidas', isLoading: false });
    }
  },

  cargarMotivos: async () => {
    if (!useNetworkStore.getState().isOnline) {
      const cached = await loadCache<MotivoSalida[]>('motivosSalida');
      if (cached) set({ motivos: cached });
      return;
    }
    try {
      const motivos = await motivoSalidaService.listar();
      set({ motivos });
      await saveCache('motivosSalida', motivos);
    } catch {}
  },

  crear: async (data: object) => {
    const { isOnline, refreshPendingCount } = useNetworkStore.getState();
    if (!isOnline) {
      await enqueue({ module: 'salida', endpoint: '/salida', method: 'POST', body: data as Record<string, any> });
      await refreshPendingCount();
      return;
    }
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
