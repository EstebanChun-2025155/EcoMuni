export interface Seguimiento {
  idSeguimiento: number;
  idEstado: number;
  estado: string;
  autor: string;
  fecha: string;
  observacion: string | null;
}

export interface SeguimientoReporte {
  idSeguimiento: number;
  idReporte: number;
  titulo: string;
  departamento: string;
  slug: string;
  estado: string;
  observacion: string | null;
  fecha: string;
}
