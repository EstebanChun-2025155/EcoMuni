import { Seguimiento } from "../interfaces/Seguimiento.interface";

export class SeguimientoEntity implements Seguimiento {
    constructor(
        public idSeguimiento: number,
        public idReporte: number,
        public idUsuario: number,
        public idEstado: number,
        public observacion: string,
        public fechaCambio: Date
    ) {}
}