import { query } from '../utils/db';
import { PuntoReciclaje } from '../model/puntoReciclaje';
import { validarPuntoReciclaje } from '../utils/validations/puntoReciclajeValidaciones';

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosPunto(punto: PuntoReciclaje): PuntoReciclaje {
    if (!validarId(punto.id_ubicacion)) {
        throw new Error("ID de ubicación inválido.");
    }

    const errores = validarPuntoReciclaje(
        punto.nombre,
        punto.materiales,
        punto.estado ?? '',
        punto.descripcion,
        punto.horario,
        punto.telefono
    );
    if (errores.length > 0) throw new Error(errores.join(" "));

    return {
        ...punto,
        nombre: punto.nombre.trim(),
        materiales: punto.materiales.trim(),
        estado: punto.estado,
        descripcion: punto.descripcion?.trim() ?? null,
        horario: punto.horario?.trim() ?? null,
        telefono: punto.telefono?.trim() ?? null
    };
}

export async function listarPuntos(): Promise<PuntoReciclaje[]> {
    const res = await query('SELECT * FROM PuntoReciclaje ORDER BY id_punto DESC');
    return res.rows;
}

export async function buscarPunto(id: number): Promise<PuntoReciclaje> {
    if (!validarId(id)) throw new Error("ID inválido.");

    const res = await query('SELECT * FROM PuntoReciclaje WHERE id_punto = $1', [id]);
    if (res.rows.length === 0) throw new Error("Punto de reciclaje no encontrado.");

    return res.rows[0];
}


export async function agregarPunto(punto: PuntoReciclaje): Promise<PuntoReciclaje> {
    const p = validarDatosPunto(punto);

    const sql = `
        INSERT INTO PuntoReciclaje (id_ubicacion, nombre, descripcion, materiales, horario, telefono, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const params = [p.id_ubicacion, p.nombre, p.descripcion, p.materiales, p.horario, p.telefono, p.estado];

    const res = await query(sql, params);
    return res.rows[0];
}

export async function actualizarPunto(id: number, datos: PuntoReciclaje): Promise<PuntoReciclaje> {
    if (!validarId(id)) throw new Error("ID inválido.");

    const p = validarDatosPunto(datos);

    const sql = `
        UPDATE PuntoReciclaje 
        SET id_ubicacion = $1, nombre = $2, descripcion = $3, materiales = $4, horario = $5, telefono = $6, estado = $7
        WHERE id_punto = $8 RETURNING *;
    `;
    const params = [p.id_ubicacion, p.nombre, p.descripcion, p.materiales, p.horario, p.telefono, p.estado, id];

    const res = await query(sql, params);
    if (res.rows.length === 0) throw new Error("Punto de reciclaje no encontrado para actualizar.");
    return res.rows[0];
}

export async function eliminarPunto(id: number): Promise<PuntoReciclaje> {
    if (!validarId(id)) throw new Error("ID inválido.");

    const res = await query('DELETE FROM PuntoReciclaje WHERE id_punto = $1 RETURNING *', [id]);
    if (res.rows.length === 0) throw new Error("Punto de reciclaje no encontrado para eliminar.");
    return res.rows[0];
}
