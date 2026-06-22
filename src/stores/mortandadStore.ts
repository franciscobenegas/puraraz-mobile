import { create } from 'zustand';
import { Mortandad, Categoria, CausaMortandad, Potrero, Propietario } from '@/types/index';
import {
  mortandadService,
  categoriaService,
  causaMortandadService,
  potreroService,
  propietarioService,
} from '@services/mortandad';
import { enqueue } from '@services/offlineQueue';
import { saveCache, loadCache } from '@services/dataCache';
import { useNetworkStore } from './networkStore';

interface MortandadStore {
  mortandades: Mortandad[];
  categorias: Categoria[];
  causasMortandad: CausaMortandad[];
  potreros: Potrero[];
  propietarios: Propietario[];
  isLoading: boolean;
  error: string | null;

  // Mortandades
  cargarMortandades: () => Promise<void>;
  crearMortandad: (data: Record<string, any>) => Promise<void>;
  actualizarMortandad: (id: string, data: FormData) => Promise<void>;
  eliminarMortandad: (id: string) => Promise<void>;

  // Datos de referencia
  cargarCategorias: () => Promise<void>;
  cargarCausasMortandad: () => Promise<void>;
  cargarPotreros: () => Promise<void>;
  cargarPropietarios: () => Promise<void>;
  cargarTodo: () => Promise<void>;

  setError: (error: string | null) => void;
}

export const useMortandadStore = create<MortandadStore>((set) => ({
  mortandades: [],
  categorias: [],
  causasMortandad: [],
  potreros: [],
  propietarios: [],
  isLoading: false,
  error: null,

  cargarMortandades: async () => {
    if (!useNetworkStore.getState().isOnline) return;
    set({ isLoading: true, error: null });
    try {
      const mortandades = await mortandadService.listar();
      set({ mortandades, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar mortandades';
      set({ error: errorMessage, isLoading: false });
    }
  },

  crearMortandad: async (data: Record<string, any>) => {
    const { isOnline, refreshPendingCount } = useNetworkStore.getState();
    if (!isOnline) {
      await enqueue({ module: 'mortandad', endpoint: '/mortandad', method: 'POST', body: data, isFormData: true });
      await refreshPendingCount();
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const nuevaMortandad = await mortandadService.crear(data);
      set((state) => ({
        mortandades: [nuevaMortandad, ...state.mortandades],
      }));
      const categorias = await categoriaService.listar();
      set({ categorias, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear mortandad';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  actualizarMortandad: async (id: string, data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const mortandadActualizada = await mortandadService.actualizar(id, data);
      set((state) => ({
        mortandades: state.mortandades.map((m) => (m.id === id ? mortandadActualizada : m)),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar mortandad';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  eliminarMortandad: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await mortandadService.eliminar(id);
      set((state) => ({
        mortandades: state.mortandades.filter((m) => m.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar mortandad';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  cargarCategorias: async () => {
    if (!useNetworkStore.getState().isOnline) {
      const cached = await loadCache<Categoria[]>('categorias');
      if (cached) set({ categorias: cached });
      return;
    }
    try {
      const categorias = await categoriaService.listar();
      set({ categorias });
      await saveCache('categorias', categorias);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  },

  cargarCausasMortandad: async () => {
    if (!useNetworkStore.getState().isOnline) {
      const cached = await loadCache<CausaMortandad[]>('causasMortandad');
      if (cached) set({ causasMortandad: cached });
      return;
    }
    try {
      const causasMortandad = await causaMortandadService.listar();
      set({ causasMortandad });
      await saveCache('causasMortandad', causasMortandad);
    } catch (error) {
      console.error('Error al cargar causas de mortandad:', error);
    }
  },

  cargarPotreros: async () => {
    if (!useNetworkStore.getState().isOnline) {
      const cached = await loadCache<Potrero[]>('potreros');
      if (cached) set({ potreros: cached });
      return;
    }
    try {
      const potreros = await potreroService.listar();
      set({ potreros });
      await saveCache('potreros', potreros);
    } catch (error) {
      console.error('Error al cargar potreros:', error);
    }
  },

  cargarPropietarios: async () => {
    if (!useNetworkStore.getState().isOnline) {
      const cached = await loadCache<Propietario[]>('propietarios');
      if (cached) set({ propietarios: cached });
      return;
    }
    try {
      const propietarios = await propietarioService.listar();
      set({ propietarios });
      await saveCache('propietarios', propietarios);
    } catch (error) {
      console.error('Error al cargar propietarios:', error);
    }
  },

  cargarTodo: async () => {
    if (!useNetworkStore.getState().isOnline) {
      const [categorias, causasMortandad, potreros, propietarios] = await Promise.all([
        loadCache<Categoria[]>('categorias'),
        loadCache<CausaMortandad[]>('causasMortandad'),
        loadCache<Potrero[]>('potreros'),
        loadCache<Propietario[]>('propietarios'),
      ]);
      set({
        ...(categorias && { categorias }),
        ...(causasMortandad && { causasMortandad }),
        ...(potreros && { potreros }),
        ...(propietarios && { propietarios }),
      });
      return;
    }
    set({ isLoading: true });
    try {
      const [mortandades, categorias, causasMortandad, potreros, propietarios] = await Promise.all([
        mortandadService.listar(),
        categoriaService.listar(),
        causaMortandadService.listar(),
        potreroService.listar(),
        propietarioService.listar(),
      ]);
      set({ mortandades, categorias, causasMortandad, potreros, propietarios });
      await Promise.all([
        saveCache('categorias', categorias),
        saveCache('causasMortandad', causasMortandad),
        saveCache('potreros', potreros),
        saveCache('propietarios', propietarios),
      ]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al cargar datos';
      set({ error: msg });
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
