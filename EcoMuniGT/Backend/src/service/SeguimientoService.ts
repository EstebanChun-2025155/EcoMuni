import { pool } from "../config/database";
import { Seguimiento } from "../models/Seguimiento";
import { validarSeguimiento } from "../utils/Validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosSeguimiento(
    seguimiento: Seguimiento
): Seguimiento {

    const errores = validarSeguimiento(
        seguimiento.idReporte,
        seguimiento.idUsuario,
        seguimiento.idEstado,
        seguimiento.observacion
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...seguimiento,
        observacion: seguimiento.observacion?.trim()
    };
}

export async function listarSeguimientos(): Promise<Seguimiento[]> {

    const resultado = await pool.query(`
        SELECT
            id_seguimiento AS "idSeguimiento",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            id_estado AS "idEstado",
            observacion,
            fecha_cambio AS "fechaCambio"
        FROM Seguimiento
        ORDER BY id_seguimiento
    `);

    return resultado.rows;
}

export async function buscarSeguimiento(
    id: number
): Promise<Seguimiento | null> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query(`
        SELECT
            id_seguimiento AS "idSeguimiento",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            id_estado AS "idEstado",
            observacion,
            fecha_cambio AS "fechaCambio"
        FROM Seguimiento
        WHERE id_seguimiento = $1
    `, [id]);

    return resultado.rows[0] ?? null;
}

export async function agregarSeguimiento(
    seguimiento: Seguimiento
): Promise<Seguimiento> {

    const nuevoSeguimiento =
        validarDatosSeguimiento(seguimiento);

    const resultado = await pool.query(`
        INSERT INTO Seguimiento (
            id_reporte,
            id_usuario,
            id_estado,
            observacion
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id_seguimiento AS "idSeguimiento",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            id_estado AS "idEstado",
            observacion,
            fecha_cambio AS "fechaCambio"
    `, [
        nuevoSeguimiento.idReporte,
        nuevoSeguimiento.idUsuario,
        nuevoSeguimiento.idEstado,
        nuevoSeguimiento.observacion ?? null
    ]);

    return resultado.rows[0];
}

export async function actualizarSeguimiento(
    id: number,
    datos: Seguimiento
): Promise<Seguimiento | null> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (
        datos.idSeguimiento !== undefined &&
        datos.idSeguimiento !== id
    ) {
        throw new Error(
            "No se puede modificar el ID del seguimiento."
        );
    }

    const seguimientoActualizado =
        validarDatosSeguimiento(datos);

    const resultado = await pool.query(`
        UPDATE Seguimiento
        SET
            id_reporte = $1,
            id_usuario = $2,
            id_estado = $3,
            observacion = $4
        WHERE id_seguimiento = $5
        RETURNING
            id_seguimiento AS "idSeguimiento",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            id_estado AS "idEstado",
            observacion,
            fecha_cambio AS "fechaCambio"
    `, [
        seguimientoActualizado.idReporte,
        seguimientoActualizado.idUsuario,
        seguimientoActualizado.idEstado,
        seguimientoActualizado.observacion ?? null,
        id
    ]);

    return resultado.rows[0] ?? null;
}

export async function eliminarSeguimiento(
    id: number
): Promise<Seguimiento | null> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query(`
        DELETE FROM Seguimiento
        WHERE id_seguimiento = $1
        RETURNING
            id_seguimiento AS "idSeguimiento",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            id_estado AS "idEstado",
            observacion,
            fecha_cambio AS "fechaCambio"
    `, [id]);

    return resultado.rows[0] ?? null;
}