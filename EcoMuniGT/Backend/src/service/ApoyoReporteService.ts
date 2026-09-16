import { pool } from "../config/database";
import { ApoyoReporte } from "../models/apoyoReporte";
import { validarApoyoReporte } from "../utils/Validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosApoyo(
    apoyo: ApoyoReporte
): ApoyoReporte {

    const errores = validarApoyoReporte(
        apoyo.idReporte,
        apoyo.idUsuario
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...apoyo
    };
}

export async function listarApoyos(): Promise<ApoyoReporte[]> {

    const resultado = await pool.query(`
        SELECT
            id_apoyo AS "idApoyo",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            fecha_apoyo AS "fechaApoyo"
        FROM ApoyoReporte
        ORDER BY id_apoyo
    `);

    return resultado.rows;
}

export async function buscarApoyo(
    id: number
): Promise<ApoyoReporte | null> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query(`
        SELECT
            id_apoyo AS "idApoyo",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            fecha_apoyo AS "fechaApoyo"
        FROM ApoyoReporte
        WHERE id_apoyo = $1
    `, [id]);

    return resultado.rows[0] ?? null;
}

export async function agregarApoyo(
    apoyo: ApoyoReporte
): Promise<ApoyoReporte> {

    const nuevoApoyo = validarDatosApoyo(apoyo);

    const resultado = await pool.query(`
        INSERT INTO ApoyoReporte (
            id_reporte,
            id_usuario
        )
        VALUES ($1, $2)
        RETURNING
            id_apoyo AS "idApoyo",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            fecha_apoyo AS "fechaApoyo"
    `, [
        nuevoApoyo.idReporte,
        nuevoApoyo.idUsuario
    ]);

    return resultado.rows[0];
}

export async function actualizarApoyo(
    id: number,
    datos: ApoyoReporte
): Promise<ApoyoReporte | null> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (
        datos.idApoyo !== undefined &&
        datos.idApoyo !== id
    ) {
        throw new Error(
            "No se puede modificar el ID del apoyo."
        );
    }

    const apoyoActualizado = validarDatosApoyo(datos);

    const resultado = await pool.query(`
        UPDATE ApoyoReporte
        SET
            id_reporte = $1,
            id_usuario = $2
        WHERE id_apoyo = $3
        RETURNING
            id_apoyo AS "idApoyo",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            fecha_apoyo AS "fechaApoyo"
    `, [
        apoyoActualizado.idReporte,
        apoyoActualizado.idUsuario,
        id
    ]);

    return resultado.rows[0] ?? null;
}

export async function eliminarApoyo(
    id: number
): Promise<ApoyoReporte | null> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query(`
        DELETE FROM ApoyoReporte
        WHERE id_apoyo = $1
        RETURNING
            id_apoyo AS "idApoyo",
            id_reporte AS "idReporte",
            id_usuario AS "idUsuario",
            fecha_apoyo AS "fechaApoyo"
    `, [id]);

    return resultado.rows[0] ?? null;
}