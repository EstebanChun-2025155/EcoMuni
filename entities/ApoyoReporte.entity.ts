import { ApoyoReporte } from "../interfaces/ApoyoReporte.interface";

export class ApoyoReporteEntity implements ApoyoReporte {
    constructor(
        public idApoyo: number,
        public idReporte: number,
        public idUsuario: number,
        public fechaApoyo: Date
    ) {}
}