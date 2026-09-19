import { pool } from "../config/database";
import type { EstadoReporte } from "../models/estadoReporte";

export async function listarEstados(): Promise<EstadoReporte[]> {
    const result = await pool.query<EstadoReporte>("SELECT id_estado AS \"idEstado\", nombre, descripcion FROM estadoreporte ORDER BY id_estado");
    return result.rows;
}
