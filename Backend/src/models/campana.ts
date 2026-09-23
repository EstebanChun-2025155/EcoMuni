import type { Ubicacion } from './ubicacion';

export const estadosCampana = ['borrador', 'publicada', 'finalizada', 'cancelada'] as const;
export type EstadoCampana = (typeof estadosCampana)[number];

export interface Campana {
  idCampana: number;
  idUsuario: number;
  idUbicacion: number | null;
  titulo: string;
  descripcion: string;
  organizador: string;
  fechaInicio: string;
  fechaFin: string;
  imagenUrl: string | null;
  estado: EstadoCampana;
  ubicacion: Ubicacion | null;
}
