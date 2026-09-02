import { query } from '../utils/db';
import { estadoReporte } from '../model/estadoReporte';
import { validarEstadoReporte } from '../utils/validations/estadoReporteValidaciones';

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosEstado(estado: estadoReporte): estadoReporte {
    const errores = validarEstadoReporte(estado.nombre, estado.descripcion);
    if (errores.length > 0) throw new Error(errores.join(" "));

    return {
        ...estado,
        nombre: estado.nombre.trim(),
        descripcion: estado.descripcion?.trim() ?? null
    };
}

export async function listarEstados(): Promise<estadoReporte[]> {
    const res = await query('SELECT * FROM EstadoReporte ORDER BY id_estado ASC');
    return res.rows;
}

export async function buscarEstado(id: number): Promise<estadoReporte> {
    if (!validarId(id)) throw new Error("ID inválido.");

    const res = await query('SELECT * FROM EstadoReporte WHERE id_estado = $1', [id]);
    if (res.rows.length === 0) throw new Error("Estado no encontrado.");

    return res.rows[0];
}


export async function agregarEstado(estado: estadoReporte): Promise<estadoReporte> {
    const e = validarDatosEstado(estado);

    const sql = 'INSERT INTO EstadoReporte (nombre, descripcion) VALUES ($1, $2) RETURNING *;';
    const res = await query(sql, [e.nombre, e.descripcion]);
    return res.rows[0];
}

export async function actualizarEstado(id: number, datos: estadoReporte): Promise<estadoReporte> {
    if (!validarId(id)) throw new Error("ID inválido.");

    const e = validarDatosEstado(datos);

    const sql = 'UPDATE EstadoReporte SET nombre = $1, descripcion = $2 WHERE id_estado = $3 RETURNING *;';
    const res = await query(sql, [e.nombre, e.descripcion, id]);
    if (res.rows.length === 0) throw new Error("Estado no encontrado para actualizar.");
    return res.rows[0];
}

export async function eliminarEstado(id: number): Promise<estadoReporte> {
    if (!validarId(id)) throw new Error("ID inválido.");

    const res = await query('DELETE FROM EstadoReporte WHERE id_estado = $1 RETURNING *', [id]);
    if (res.rows.length === 0) throw new Error("Estado no encontrado para eliminar.");
    return res.rows[0];
}
