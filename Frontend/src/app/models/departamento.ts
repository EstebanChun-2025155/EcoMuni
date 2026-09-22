export interface PortadaDepartamento {
  slug: string;
  nombre: string;
  cabecera: string;
  municipios: number;
  frase: string;
  imagen: string;
}
export interface Categoria { idCategoria: number; categoria: string; }
export interface EstadoReporte { idEstado: number; nombre: string; }
export interface Reporte {
  idReporte: number;
  idUsuario: number;
  idCategoria: number;
  idEstado: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
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
export interface DetalleReporte extends Reporte {
  comentarios: { idComentario: number; autor: string; fecha: string; texto: string }[];
  seguimientos: { idSeguimiento: number; idEstado: number; estado: string; autor: string; fecha: string; observacion: string | null }[];
  evidencias: { idEvidencia: number; urlImagen: string; descripcion: string | null }[];
  puedeAdjuntar: boolean;
}
export interface PuntoReciclaje {
  idPunto: number;
  nombre: string;
  ubicacion: string;
  materiales: string;
  descripcion: string | null;
  horario: string | null;
  telefono: string | null;
}
export interface PanelDepartamento {
  reportes: Reporte[];
  puntos: PuntoReciclaje[];
  categorias: Categoria[];
  estados: EstadoReporte[];
  puedeGestionar: boolean;
  total: number;
  pagina: number;
  porPagina: number;
}
export interface FiltrosReporte {
  pagina: number;
  idEstado: number | null;
  idCategoria: number | null;
  prioridad: string;
}
export interface NuevoReporte {
  titulo: string;
  descripcion: string;
  idCategoria: number | null;
  prioridad: 'baja' | 'media' | 'alta';
  municipio: string;
  zona: string;
  direccion: string;
  referencia: string;
}
export interface NuevoPunto {
  nombre: string;
  materiales: string;
  municipio: string;
  zona: string;
  direccion: string;
  referencia: string;
  descripcion: string;
  horario: string;
  telefono: string;
}
