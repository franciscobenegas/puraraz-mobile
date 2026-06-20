export interface Usuario {
  id: string;
  email: string;
  username: string;
  establecimiento: string;
  rol: 'PEON' | 'ADMIN';
  activo: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
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
