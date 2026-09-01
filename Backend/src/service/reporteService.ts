import { pool } from "../config/database";
import { Reporte } from "../models/reporte";
import { validarReporte } from "../utils/validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosReporte(reporte: Reporte): Reporte {
    const errores = validarReporte(
        reporte.idUsuario,
        reporte.idCategoria,
        reporte.idUbicacion,
        reporte.idEstado,
        reporte.codigo,
        reporte.titulo,
        reporte.descripcion,
        reporte.prioridad,
        reporte.motivoRechazo,
        reporte.fechaReporte,
        reporte.fechaActualizacion
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...reporte,
        codigo: reporte.codigo.trim(),
        titulo: reporte.titulo.trim(),
        descripcion: reporte.descripcion.trim(),
        prioridad: reporte.prioridad.trim(),
        motivoRechazo: reporte.motivoRechazo?.trim()
    };
}

export async function listarReportes(): Promise<Reporte[]> {
    const resultado = await pool.query<Reporte>(
        `select id_reporte as "idReporte", id_usuario as "idUsuario", id_categoria as "idCategoria", id_ubicacion as "idUbicacion", id_estado as "idEstado", codigo, titulo, descripcion, prioridad, motivo_rechazo as "motivoRechazo", fecha_reporte as "fechaReporte", fecha_actualizacion as "fechaActualizacion"
         from reporte
         order by id_reporte`
    );

    return resultado.rows;
}

export async function buscarReporte(id: number): Promise<Reporte | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Reporte>(
        `select id_reporte as "idReporte", id_usuario as "idUsuario", id_categoria as "idCategoria", id_ubicacion as "idUbicacion", id_estado as "idEstado", codigo, titulo, descripcion, prioridad, motivo_rechazo as "motivoRechazo", fecha_reporte as "fechaReporte", fecha_actualizacion as "fechaActualizacion"
         from reporte
         where id_reporte = $1`,
        [id]
    );

    return resultado.rows[0] || null;
}

export async function agregarReporte(reporte: Reporte): Promise<Reporte> {
    const nuevoReporte = validarDatosReporte(reporte);

    const resultado = await pool.query<Reporte>(
        `insert into reporte (id_usuario, id_categoria, id_ubicacion, id_estado, codigo, titulo, descripcion, prioridad, motivo_rechazo, fecha_reporte, fecha_actualizacion)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         returning id_reporte as "idReporte", id_usuario as "idUsuario", id_categoria as "idCategoria", id_ubicacion as "idUbicacion", id_estado as "idEstado", codigo, titulo, descripcion, prioridad, motivo_rechazo as "motivoRechazo", fecha_reporte as "fechaReporte", fecha_actualizacion as "fechaActualizacion"`,
        [
            nuevoReporte.idUsuario,
            nuevoReporte.idCategoria,
            nuevoReporte.idUbicacion,
            nuevoReporte.idEstado,
            nuevoReporte.codigo,
            nuevoReporte.titulo,
            nuevoReporte.descripcion,
            nuevoReporte.prioridad,
            nuevoReporte.motivoRechazo,
            nuevoReporte.fechaReporte,
            nuevoReporte.fechaActualizacion
        ]
    );

    return resultado.rows[0];
}

export async function actualizarReporte(
    id: number,
    datos: Reporte
): Promise<Reporte | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (datos.idReporte !== undefined && datos.idReporte !== id) {
        throw new Error("No se puede modificar el ID del reporte.");
    }

    const reporteActualizado = validarDatosReporte(datos);

    const resultado = await pool.query<Reporte>(
        `update reporte
         set id_usuario = $1, id_categoria = $2, id_ubicacion = $3, id_estado = $4, codigo = $5, titulo = $6, descripcion = $7, prioridad = $8, motivo_rechazo = $9, fecha_reporte = $10, fecha_actualizacion = $11
         where id_reporte = $12
         returning id_reporte as "idReporte", id_usuario as "idUsuario", id_categoria as "idCategoria", id_ubicacion as "idUbicacion", id_estado as "idEstado", codigo, titulo, descripcion, prioridad, motivo_rechazo as "motivoRechazo", fecha_reporte as "fechaReporte", fecha_actualizacion as "fechaActualizacion"`,
        [
            reporteActualizado.idUsuario,
            reporteActualizado.idCategoria,
            reporteActualizado.idUbicacion,
            reporteActualizado.idEstado,
            reporteActualizado.codigo,
            reporteActualizado.titulo,
            reporteActualizado.descripcion,
            reporteActualizado.prioridad,
            reporteActualizado.motivoRechazo,
            reporteActualizado.fechaReporte,
            reporteActualizado.fechaActualizacion,
            id
        ]
    );

    return resultado.rows[0] || null;
}

export async function eliminarReporte(id: number): Promise<Reporte | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Reporte>(
        `delete from reporte
         where id_reporte = $1
         returning id_reporte as "idReporte", id_usuario as "idUsuario", id_categoria as "idCategoria", id_ubicacion as "idUbicacion", id_estado as "idEstado", codigo, titulo, descripcion, prioridad, motivo_rechazo as "motivoRechazo", fecha_reporte as "fechaReporte", fecha_actualizacion as "fechaActualizacion"`,
        [id]
    );

    return resultado.rows[0] || null;
}