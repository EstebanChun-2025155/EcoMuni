import { pool } from "../config/database";
import { Evidencia } from "../models/evidencia";
import { validarEvidencia } from "../utils/validaciones";

export const maximoImagen = 5 * 1024 * 1024; // Límite de tamaño (5 MB)

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosEvidencia(evidencia: Partial<Evidencia>): Partial<Evidencia> {
    if (!evidencia) {
        throw new Error("No se proporcionaron los datos de la evidencia.");
    }

    const fechaSubidaDate = evidencia.fechaSubida ? new Date(evidencia.fechaSubida) : new Date();

    const errores = validarEvidencia(
        evidencia.idReporte!,
        evidencia.urlImagen || "",
        evidencia.descripcion,
        fechaSubidaDate
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...evidencia,
        urlImagen: evidencia.urlImagen?.trim(),
        descripcion: evidencia.descripcion?.trim(),
        fechaSubida: fechaSubidaDate
    };
}

export async function listarEvidenciasByReporte(departamento: string, idReporte: number) {
    if (!validarId(idReporte)) {
        throw new Error("ID de reporte inválido.");
    }

    const resultado = await pool.query(
        `select e.id_evidencia as "idEvidencia", e.id_reporte as "idReporte", 
                e.url_imagen as "urlImagen", e.descripcion, e.fecha_subida as "fechaSubida"
         from evidencia e
         join reporte r on r.id_reporte = e.id_reporte
         join ubicacion u on u.id_ubicacion = r.id_ubicacion
         where e.id_reporte = $1 and u.departamento = $2
         order by e.fecha_subida desc`,
        [idReporte, departamento]
    );

    return resultado.rows;
}

export async function buscarEvidencia(departamento: string, id: number): Promise<Evidencia | null> {
    if (!validarId(id)) {
        throw new Error("ID de evidencia inválido.");
    }

    const resultado = await pool.query<Evidencia>(
        `select e.id_evidencia as "idEvidencia", e.id_reporte as "idReporte", 
                e.url_imagen as "urlImagen", e.descripcion, e.fecha_subida as "fechaSubida"
         from evidencia e
         join reporte r on r.id_reporte = e.id_reporte
         join ubicacion u on u.id_ubicacion = r.id_ubicacion
         where e.id_evidencia = $1 and u.departamento = $2`,
        [id, departamento]
    );

    return resultado.rows[0] || null;
}

export async function agregarEvidencia(departamento: string, cuerpo: any, actor: any): Promise<Evidencia> {
    const datosValidados = validarDatosEvidencia(cuerpo);

    const reporteValido = await pool.query(
        `select r.id_reporte 
         from reporte r 
         join ubicacion u on u.id_ubicacion = r.id_ubicacion 
         where r.id_reporte = $1 and u.departamento = $2`,
        [datosValidados.idReporte, departamento]
    );

    if (reporteValido.rowCount === 0) {
        throw new Error("El reporte especificado no existe o no pertenece a este departamento.");
    }

    const resultado = await pool.query<Evidencia>(
        `insert into evidencia (id_reporte, url_imagen, descripcion, fecha_subida)
         values ($1, $2, $3, $4)
         returning id_evidencia as "idEvidencia", id_reporte as "idReporte", 
                   url_imagen as "urlImagen", descripcion, fecha_subida as "fechaSubida"`,
        [datosValidados.idReporte, datosValidados.urlImagen, datosValidados.descripcion, datosValidados.fechaSubida]
    );

    return resultado.rows[0];
}

export async function actualizarEvidencia(
    departamento: string,
    id: number,
    datos: Partial<Evidencia>
): Promise<Evidencia | null> {
    if (!validarId(id)) {
        throw new Error("ID de evidencia inválido.");
    }

    const evidenciaExistente = await buscarEvidencia(departamento, id);
    if (!evidenciaExistente) {
        throw new Error("La evidencia no existe o no pertenece al departamento.");
    }

    const evidenciaActualizada = validarDatosEvidencia({
        ...evidenciaExistente,
        ...datos,
        idReporte: evidenciaExistente.idReporte
    });

    const resultado = await pool.query<Evidencia>(
        `update evidencia
         set url_imagen = $1, descripcion = $2, fecha_subida = $3
         where id_evidencia = $4
         returning id_evidencia as "idEvidencia", id_reporte as "idReporte", 
                   url_imagen as "urlImagen", descripcion, fecha_subida as "fechaSubida"`,
        [evidenciaActualizada.urlImagen, evidenciaActualizada.descripcion, evidenciaActualizada.fechaSubida, id]
    );

    return resultado.rows[0] || null;
}

export async function eliminarEvidencia(departamento: string, id: number): Promise<Evidencia | null> {
    if (!validarId(id)) {
        throw new Error("ID de evidencia inválido.");
    }

    const resultado = await pool.query<Evidencia>(
        `delete from evidencia e
         using reporte r, ubicacion u
         where e.id_reporte = r.id_reporte 
           and r.id_ubicacion = u.id_ubicacion
           and e.id_evidencia = $1 
           and u.departamento = $2
         returning e.id_evidencia as "idEvidencia", e.id_reporte as "idReporte", 
                   e.url_imagen as "urlImagen", e.descripcion, e.fecha_subida as "fechaSubida"`,
        [id, departamento]
    );

    return resultado.rows[0] || null;
}