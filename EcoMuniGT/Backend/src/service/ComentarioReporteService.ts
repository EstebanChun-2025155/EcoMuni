import { pool } from "../config/database";
import { ComentarioReporte } from "../models/comentarioReporte";
import { validarComentarioReporte } from "../utils/Validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosComentario(
    comentario: ComentarioReporte
): ComentarioReporte {

    const errores = validarComentarioReporte(
        comentario.idReporte,
        comentario.idUsuario,
        comentario.comentario,
        comentario.estado
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...comentario,
        comentario: comentario.comentario.trim(),
        estado: comentario.estado.trim()
    };
}

export async function listarComentarios(): Promise<ComentarioReporte[]> {

    const resultado = await pool.query(`
        SELECT
            id_comentario AS "idComentario",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            comentario,
            fecha_comentario AS "fechaComentario",
            estado
        FROM ComentarioReporte
        ORDER BY id_comentario
    `);

    return resultado.rows;
}

export async function buscarComentario(
    id: number
): Promise<ComentarioReporte | null> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query(`
        SELECT
            id_comentario AS "idComentario",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            comentario,
            fecha_comentario AS "fechaComentario",
            estado
        FROM ComentarioReporte
        WHERE id_comentario = $1
    `, [id]);

    return resultado.rows[0] ?? null;
}

export async function agregarComentario(
    comentario: ComentarioReporte
): Promise<ComentarioReporte> {

    const nuevoComentario =
        validarDatosComentario(comentario);

    const resultado = await pool.query(`
        INSERT INTO ComentarioReporte (
            id_reporte,
            id_usuario,
            comentario,
            estado
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id_comentario AS "idComentario",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            comentario,
            fecha_comentario AS "fechaComentario",
            estado
    `, [
        nuevoComentario.idReporte,
        nuevoComentario.idUsuario,
        nuevoComentario.comentario,
        nuevoComentario.estado
    ]);

    return resultado.rows[0];
}

export async function actualizarComentario(
    id: number,
    datos: ComentarioReporte
): Promise<ComentarioReporte | null> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (
        datos.idComentario !== undefined &&
        datos.idComentario !== id
    ) {
        throw new Error(
            "No se puede modificar el ID del comentario."
        );
    }

    const comentarioActualizado =
        validarDatosComentario(datos);

    const resultado = await pool.query(`
        UPDATE ComentarioReporte
        SET
            id_reporte = $1,
            id_usuario = $2,
            comentario = $3,
            estado = $4
        WHERE id_comentario = $5
        RETURNING
            id_comentario AS "idComentario",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            comentario,
            fecha_comentario AS "fechaComentario",
            estado
    `, [
        comentarioActualizado.idReporte,
        comentarioActualizado.idUsuario,
        comentarioActualizado.comentario,
        comentarioActualizado.estado,
        id
    ]);

    return resultado.rows[0] ?? null;
}

export async function eliminarComentario(
    id: number
): Promise<ComentarioReporte | null> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query(`
        DELETE FROM ComentarioReporte
        WHERE id_comentario = $1
        RETURNING
            id_comentario AS "idComentario",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            comentario,
            fecha_comentario AS "fechaComentario",
            estado
    `, [id]);

    return resultado.rows[0] ?? null;
}