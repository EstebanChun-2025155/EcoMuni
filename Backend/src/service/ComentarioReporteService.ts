import { pool } from "../config/database";
import type { Conexion } from "../config/transaccion";
import type { ComentarioReporte } from "../models/ComentarioReporte";

export async function listarComentarios(idReporte: number): Promise<ComentarioReporte[]> {
    const result = await pool.query<ComentarioReporte>(
        "SELECT c.id_comentario AS \"idComentario\", concat_ws(' ', u.nombres, u.apellidos) AS autor, to_char(c.fecha_comentario, 'DD/MM/YYYY') AS fecha, c.comentario AS texto FROM comentarioreporte c JOIN usuario u ON u.id_usuario = c.id_usuario WHERE c.id_reporte = $1 AND c.estado = 'visible' ORDER BY c.id_comentario",
        [idReporte]
    );
    return result.rows;
}

export async function agregarComentario(db: Conexion, idReporte: number, idUsuario: number, comentario: string): Promise<void> {
    await db.query("INSERT INTO comentarioreporte (id_reporte, id_usuario, comentario, estado) VALUES ($1, $2, $3, 'visible')", [idReporte, idUsuario, comentario]);
}