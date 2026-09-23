export interface Pagina<T> {
  items: T[];
  total: number;
  pagina: number;
  porPagina: number;
}
export interface EvidenciaConsulta {
  idEvidencia: number;
  idReporte: number;
  urlImagen: string;
  descripcion: string | null;
  titulo: string;
  departamento: string;
  slug: string;
  fecha: string;
}
export interface CategoriaConsulta {
  idCategoria: number;
  categoria: string;
  descripcion: string | null;
  total: number;
}
export interface UbicacionConsulta {
  idUbicacion: number;
  departamento: string;
  municipio: string;
  zona: string | null;
  direccion: string | null;
  referencia: string | null;
  slug: string;
}
