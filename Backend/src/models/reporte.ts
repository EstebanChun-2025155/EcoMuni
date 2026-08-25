export interface Reporte {
    idReporte: number;
    idUsuario: number;
    idCategoria: number;
    idUbicacion: number;
    idEstado: number;
    codigo: string;
    titulo: string;
    descripcion: string;
    prioridad: string;
    motivoRechazo: string;
    fechaReporte: Date;
    fechaActualizacion: Date;
}