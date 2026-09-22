export interface Seguimiento {
    idSeguimiento: number;
    idEstado: number;
    estado: string;
    autor: string;
    fecha: string;
    observacion: string | null;
}
