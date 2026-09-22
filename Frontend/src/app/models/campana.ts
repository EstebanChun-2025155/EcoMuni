export type EstadoCampana = 'borrador' | 'publicada' | 'finalizada' | 'cancelada';
export interface UbicacionCampana {
  departamento: string;
  municipio: string;
  zona: string | null;
  direccion: string | null;
  referencia: string | null;
}
export interface DatosCampana {
  titulo: string;
  descripcion: string;
  organizador: string;
  fechaInicio: string;
  fechaFin: string;
  imagenUrl: string | null;
  estado: EstadoCampana;
  ubicacion: UbicacionCampana | null;
}
export interface CampanaRegistro extends DatosCampana {
  idCampana: number;
  idUsuario: number;
  idUbicacion: number | null;
}
export interface PanelCampanas {
  campanas: CampanaRegistro[];
  total: number;
  pagina: number;
  porPagina: number;
  puedeGestionar: boolean;
}
export interface FiltrosCampana {
  pagina: number;
  busqueda: string;
  estado: EstadoCampana | '';
}
