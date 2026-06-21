import { create } from 'zustand';
import { Mortandad, Categoria, CausaMortandad, Potrero, Propietario } from '@/types/index';
import {
  mortandadService,
  categoriaService,
  causaMortandadService,
  potreroService,
  propietarioService,
} from '@services/mortandad';

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
  crearMortandad: (data: FormData) => Promise<void>;
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
    set({ isLoading: true, error: null });
    try {
      const mortandades = await mortandadService.listar();
      set({ mortandades, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar mortandades';
      set({ error: errorMessage, isLoading: false });
    }
  },

  crearMortandad: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const nuevaMortandad = await mortandadService.crear(data);
      set((state) => ({
        mortandades: [nuevaMortandad, ...state.mortandades],
      }));
      // Recarga categorías para reflejar el decremento que hace el backend
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
    try {
      const categorias = await categoriaService.listar();
      set({ categorias });
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  },

  cargarCausasMortandad: async () => {
    try {
      const causasMortandad = await causaMortandadService.listar();
      set({ causasMortandad });
    } catch (error) {
      console.error('Error al cargar causas de mortandad:', error);
    }
  },

  cargarPotreros: async () => {
    try {
      const potreros = await potreroService.listar();
      set({ potreros });
    } catch (error) {
      console.error('Error al cargar potreros:', error);
    }
  },

  cargarPropietarios: async () => {
    try {
      const propietarios = await propietarioService.listar();
      set({ propietarios });
    } catch (error) {
      console.error('Error al cargar propietarios:', error);
    }
  },

  cargarTodo: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        mortandadService.listar().then((mortandades) => set({ mortandades })),
        categoriaService.listar().then((categorias) => set({ categorias })),
        causaMortandadService.listar().then((causasMortandad) => set({ causasMortandad })),
        potreroService.listar().then((potreros) => set({ potreros })),
        propietarioService.listar().then((propietarios) => set({ propietarios })),
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
