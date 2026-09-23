export type PrioridadReporte = 'baja' | 'media' | 'alta';

export interface Reporte {
  idReporte: number;
  idUsuario: number;
  idCategoria: number;
  idUbicacion: number;
  idEstado: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  prioridad: PrioridadReporte;
  estado: string;
  categoria: string;
  ubicacion: string;
  fecha: string;
  motivoRechazo: string | null;
  apoyos: number;
  apoyado: boolean;
  totalComentarios: number;
  miniatura: string | null;
}
