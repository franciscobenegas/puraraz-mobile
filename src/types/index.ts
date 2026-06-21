export interface Usuario {
  id: string;
  email: string;
  username: string;
  establecimiento: string;
  rol: 'PEON' | 'ADMIN';
  activo: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  usuario: string;
  establesimiento: string;
  rol: 'PEON' | 'ADMIN';
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: LoginUser;
  message: string;
}

export type Sexo = 'Macho' | 'Hembra';
export type Edad = 'RecienNacido' | 'Adulto' | 'Joven';
export type Pelaje = 'Negro' | 'Colorado' | 'Blanco' | 'Bayo' | 'Barcino' | 'Overo' | 'Hosco' | 'Pampa';

export interface Categoria {
  id: string;
  nombre: string;
  edad: Edad;
  sexo: Sexo;
  pelaje: Pelaje;
  cantidad: number;
  promedioKilos?: number;
  precioVentaCabeza?: number;
  precioVentaKilo?: number;
  precioCostoCabeza?: number;
  precioCostoKilo?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CausaMortandad {
  id: string;
  nombre: string;
  createdAt: string;
  updatedAt: string;
}

export interface Potrero {
  id: string;
  nombre: string;
  capacidad: number;
  establesimiento: string;
  createdAt: string;
  updatedAt: string;
}

export interface Propietario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  usuario: string;
  establesimiento: string;
}

export interface Mortandad {
  id: string;
  fecha: string;
  propietarioId: string;
  numeroAnimal: string;
  categoriaId: string;
  causaId: string;
  potreroId: string;
  ubicacionGps: string;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  usuario: string;
  establesimiento: string;
  createdAt: string;
  updatedAt: string;
}

export interface MortandadFormData {
  fecha: string;
  propietarioId: string;
  numeroAnimal: string;
  categoriaId: string;
  causaId: string;
  potreroId: string;
  ubicacionGps: string;
  fotos: {
    foto1?: string;
    foto2?: string;
    foto3?: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
}

// Motivos
export interface MotivoEntrada { id: string; nombre: string; }
export interface MotivoSalida  { id: string; nombre: string; }
export interface MotivoPesaje  { id: string; nombre: string; }

// Nacimiento
export interface Nacimiento {
  id: string;
  fecha: string;
  numeroVaca?: string;
  numeroTernero?: string;
  propietarioId: string;
  potreroId: string;
  sexo: Sexo;
  peso?: number;
  pelaje: Pelaje;
  usuario: string;
  establesimiento: string;
  createdAt: string;
  updatedAt: string;
}

// Entrada
export interface EntradaItem {
  id: string;
  entradaId: string;
  categoriaId: string;
  cantidad: number;
}
export interface Entrada {
  id: string;
  fecha: string;
  propietarioId: string;
  motivoId: string;
  NombreEstanciaOrigen?: string;
  usuario: string;
  establesimiento: string;
  items: EntradaItem[];
  createdAt: string;
  updatedAt: string;
}

// Salida
export interface SalidaItem {
  id: string;
  salidaId: string;
  categoriaId: string;
  cantidad: number;
}
export interface Salida {
  id: string;
  fecha: string;
  propietarioId: string;
  motivoId: string;
  NombreEstanciaSalida?: string;
  usuario: string;
  establesimiento: string;
  items: SalidaItem[];
  createdAt: string;
  updatedAt: string;
}

// Pesaje
export interface Pesaje {
  id: string;
  fecha: string;
  numeroAnimal: string;
  peso: number;
  propietarioId: string;
  categoriaId?: string;
  motivoId: string;
  potreroId?: string;
  observacion?: string;
  usuario: string;
  establesimiento: string;
  createdAt: string;
  updatedAt: string;
}
