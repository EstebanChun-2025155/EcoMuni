export type EstadoPunto = 'activo' | 'inactivo';

export interface PuntoReciclaje {
  id_punto?: number;
  id_ubicacion: number;
  nombre: string;
  descripcion?: string | null;
  materiales: string;
  horario?: string | null;
  telefono?: string | null;
  estado?: EstadoPunto;
}
