import { pool } from "../config/database.js";
import { ApiError } from "../utils/apiError.js";

export interface EstadoReporte {
    idEstado: number;
    nombre: string;
}

export async function listarEstados(): Promise<EstadoReporte[]> {
    const resultado = await pool.query<EstadoReporte>(
        `select id_estado as "idEstado", nombre
         from EstadoReporte
         order by id_estado`
    );
    return resultado.rows;
}

/** Estado con el que nace todo reporte nuevo. */
export async function estadoInicial(): Promise<number> {
    const resultado = await pool.query<{ id_estado: number }>(
        "select id_estado from EstadoReporte order by id_estado limit 1"
    );
    const estado = resultado.rows[0];
    if (!estado) throw new ApiError(500, "No hay estados de reporte configurados en la base de datos.");
    return estado.id_estado;
}