import { ComentarioReporte } from "../interfaces/ComentarioReporte.interface";

export class ComentarioReporteEntity implements ComentarioReporte {
    constructor(
        public idComentario: number,
        public idReporte: number,
        public idUsuario: number,
        public comentario: string,
        public fechaComentario: Date,
        public estado: string
    ) {}
}