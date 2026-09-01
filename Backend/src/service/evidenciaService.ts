import { pool } from "../config/database";
import { Evidencia } from "../models/evidencia";
import { validarEvidencia } from "../utils/validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosEvidencia(evidencia: Evidencia): Evidencia {
    const errores = validarEvidencia(
        evidencia.idReporte,
        evidencia.urlImagen,
        evidencia.descripcion,
        evidencia.fechaSubida
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...evidencia,
        urlImagen: evidencia.urlImagen.trim(),
        descripcion: evidencia.descripcion?.trim()
    };
}

export async function listarEvidencias(): Promise<Evidencia[]> {
    const resultado = await pool.query<Evidencia>(
        `select id_evidencia as "idEvidencia", id_reporte as "idReporte", url_imagen as "urlImagen", descripcion, fecha_subida as "fechaSubida"
         from evidencia
         order by id_evidencia`
    );

    return resultado.rows;
}

export async function buscarEvidencia(id: number): Promise<Evidencia | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Evidencia>(
        `select id_evidencia as "idEvidencia", id_reporte as "idReporte", url_imagen as "urlImagen", descripcion, fecha_subida as "fechaSubida"
         from evidencia
         where id_evidencia = $1`,
        [id]
    );

    return resultado.rows[0] || null;
}

export async function agregarEvidencia(evidencia: Evidencia): Promise<Evidencia> {
    const nuevaEvidencia = validarDatosEvidencia(evidencia);

    const resultado = await pool.query<Evidencia>(
        `insert into evidencia (id_reporte, url_imagen, descripcion, fecha_subida)
         values ($1, $2, $3, $4)
         returning id_evidencia as "idEvidencia", id_reporte as "idReporte", url_imagen as "urlImagen", descripcion, fecha_subida as "fechaSubida"`,
        [nuevaEvidencia.idReporte, nuevaEvidencia.urlImagen, nuevaEvidencia.descripcion, nuevaEvidencia.fechaSubida]
    );

    return resultado.rows[0];
}

export async function actualizarEvidencia(
    id: number,
    datos: Evidencia
): Promise<Evidencia | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (datos.idEvidencia !== undefined && datos.idEvidencia !== id) {
        throw new Error("No se puede modificar el ID de la evidencia.");
    }

    const evidenciaActualizada = validarDatosEvidencia(datos);

    const resultado = await pool.query<Evidencia>(
        `update evidencia
         set id_reporte = $1, url_imagen = $2, descripcion = $3, fecha_subida = $4
         where id_evidencia = $5
         returning id_evidencia as "idEvidencia", id_reporte as "idReporte", url_imagen as "urlImagen", descripcion, fecha_subida as "fechaSubida"`,
        [evidenciaActualizada.idReporte, evidenciaActualizada.urlImagen, evidenciaActualizada.descripcion, evidenciaActualizada.fechaSubida, id]
    );

    return resultado.rows[0] || null;
}

export async function eliminarEvidencia(id: number): Promise<Evidencia | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Evidencia>(
        `delete from evidencia
         where id_evidencia = $1
         returning id_evidencia as "idEvidencia", id_reporte as "idReporte", url_imagen as "urlImagen", descripcion, fecha_subida as "fechaSubida"`,
        [id]
    );

    return resultado.rows[0] || null;
}