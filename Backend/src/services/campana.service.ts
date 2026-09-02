import { query } from '../utils/db';
import { Campana } from "../model/campana";
import { validarCampana } from "../utils/validations/campanaValidaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosCampana(campana: Campana): Campana {
    if (campana.id_campana !== undefined && !validarId(campana.id_campana)) {
        throw new Error("ID de campaña inválido.");
    }
    if (!validarId(campana.id_usuario)) {
        throw new Error("ID de usuario inválido.");
    }
    if (campana.id_ubicacion !== undefined && campana.id_ubicacion !== null && !validarId(campana.id_ubicacion)) {
        throw new Error("ID de ubicación inválido.");
    }

    const errores = validarCampana(
        campana.titulo,
        campana.descripcion,
        campana.organizador,
        campana.fecha_inicio,
        campana.fecha_fin,
        campana.estado ?? '',
        campana.imagen_url
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...campana,
        titulo: campana.titulo.trim(),
        descripcion: campana.descripcion.trim(),
        organizador: campana.organizador.trim(),
        id_ubicacion: campana.id_ubicacion ?? null,
        imagen_url: campana.imagen_url?.trim() ?? null,
        estado: campana.estado
    };
}

export async function listarCampanas(): Promise<Campana[]> {
    const res = await query('SELECT * FROM Campana ORDER BY id_campana DESC');
    return res.rows;
}

export async function buscarCampana(id: number): Promise<Campana> {
    if (!validarId(id)) throw new Error("ID inválido.");
    
    const res = await query('SELECT * FROM Campana WHERE id_campana = $1', [id]);
    if (res.rows.length === 0) throw new Error("Campaña no encontrada.");
    return res.rows[0];
}

export async function agregarCampana(campana: Campana): Promise<Campana> {
    const c = validarDatosCampana(campana);
    
    const sql = `
        INSERT INTO Campana (id_usuario, id_ubicacion, titulo, descripcion, organizador, fecha_inicio, fecha_fin, imagen_url, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;
    const params = [c.id_usuario, c.id_ubicacion, c.titulo, c.descripcion, c.organizador, c.fecha_inicio, c.fecha_fin, c.imagen_url, c.estado];
    
    const res = await query(sql, params);
    return res.rows[0];
}

export async function actualizarCampana(id: number, datos: Campana): Promise<Campana> {
    if (!validarId(id)) throw new Error("ID inválido.");
    if (datos.id_campana !== undefined && datos.id_campana !== id) {
        throw new Error("No se puede modificar el ID de la campaña.");
    }

    const c = validarDatosCampana({ ...datos, id_campana: id });
    
    const sql = `
        UPDATE Campana 
        SET id_usuario = $1, id_ubicacion = $2, titulo = $3, descripcion = $4, organizador = $5, fecha_inicio = $6, fecha_fin = $7, imagen_url = $8, estado = $9
        WHERE id_campana = $10 RETURNING *;
    `;
    const params = [c.id_usuario, c.id_ubicacion, c.titulo, c.descripcion, c.organizador, c.fecha_inicio, c.fecha_fin, c.imagen_url, c.estado, id];
    
    const res = await query(sql, params);
    if (res.rows.length === 0) throw new Error("Campaña no encontrada para actualizar.");
    return res.rows[0];
}

export async function eliminarCampana(id: number): Promise<Campana> {
    if (!validarId(id)) throw new Error("ID inválido.");
    
    const res = await query('DELETE FROM Campana WHERE id_campana = $1 RETURNING *', [id]);
    if (res.rows.length === 0) throw new Error("Campaña no encontrada para eliminar.");
    return res.rows[0];
}
