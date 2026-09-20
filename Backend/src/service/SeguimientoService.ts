import { pool } from "../config/database";
import type { Conexion } from "../config/transaccion";
import type { Seguimiento } from "../models/Seguimiento";

export async function listarSeguimientos(idReporte: number): Promise<Seguimiento[]> {
    const result = await pool.query<Seguimiento>(
        "SELECT s.id_seguimiento AS \"idSeguimiento\", s.id_estado AS \"idEstado\", e.nombre AS estado, concat_ws(' ', u.nombres, u.apellidos) AS autor, to_char(s.fecha_cambio, 'DD/MM/YYYY') AS fecha, s.observacion FROM seguimiento s JOIN estadoreporte e ON e.id_estado = s.id_estado JOIN usuario u ON u.id_usuario = s.id_usuario WHERE s.id_reporte = $1 ORDER BY s.id_seguimiento",
        [idReporte]
    );
    return result.rows;
}

export async function agregarSeguimiento(db: Conexion, idReporte: number, idUsuario: number, idEstado: number, observacion: string): Promise<void> {
    await db.query("INSERT INTO seguimiento (id_reporte, id_usuario, id_estado, observacion) VALUES ($1, $2, $3, $4)", [idReporte, idUsuario, idEstado, observacion]);
}
