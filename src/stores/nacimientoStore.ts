import { create } from 'zustand';
import { Nacimiento } from '@/types/index';
import { nacimientoService } from '@services/nacimiento';
import { enqueue } from '@services/offlineQueue';
import { useNetworkStore } from './networkStore';

interface NacimientoStore {
  nacimientos: Nacimiento[];
  isLoading: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  crear: (data: object) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useNacimientoStore = create<NacimientoStore>((set) => ({
  nacimientos: [],
  isLoading: false,
  error: null,

  cargar: async () => {
    if (!useNetworkStore.getState().isOnline) return;
    set({ isLoading: true, error: null });
    try {
      const nacimientos = await nacimientoService.listar();
      set({ nacimientos, isLoading: false });
    } catch (error) {
      console.error('[nacimientoStore] cargar error:', error);
      set({ error: error instanceof Error ? error.message : 'Error al cargar nacimientos', isLoading: false });
    }
  },

  crear: async (data: object) => {
    const { isOnline, refreshPendingCount } = useNetworkStore.getState();
    if (!isOnline) {
      await enqueue({ module: 'nacimiento', endpoint: '/nacimiento', method: 'POST', body: data as Record<string, any> });
      await refreshPendingCount();
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const nuevo = await nacimientoService.crear(data);
      set((state) => ({ nacimientos: [nuevo, ...state.nacimientos], isLoading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al crear nacimiento', isLoading: false });
      throw error;
    }
  },

  eliminar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await nacimientoService.eliminar(id);
      set((state) => ({ nacimientos: state.nacimientos.filter((n) => n.id !== id), isLoading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al eliminar', isLoading: false });
      throw error;
    }
  },

  setError: (error) => set({ error }),
}));
