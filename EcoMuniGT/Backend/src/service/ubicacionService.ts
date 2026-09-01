import { pool } from "../config/database";
import { Ubicacion } from "../models/ubicacion";
import { validarUbicacion } from "../utils/validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosUbicacion(ubicacion: Ubicacion): Ubicacion {
    const errores = validarUbicacion(
        ubicacion.departamento,
        ubicacion.municipio,
        ubicacion.zona,
        ubicacion.direccion,
        ubicacion.referencia
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...ubicacion,
        departamento: ubicacion.departamento.trim(),
        municipio: ubicacion.municipio.trim(),
        zona: ubicacion.zona?.trim() || null,
        direccion: ubicacion.direccion?.trim() || null,
        referencia: ubicacion.referencia?.trim() || null
    };
}

export async function listarUbicaciones(): Promise<Ubicacion[]> {
    const resultado = await pool.query<Ubicacion>(
        `select id_ubicacion as "idUbicacion", departamento, municipio,
                zona, direccion, referencia
         from ubicacion
         order by id_ubicacion`
    );

    return resultado.rows;
}

export async function buscarUbicacion(id: number): Promise<Ubicacion | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Ubicacion>(
        `select id_ubicacion as "idUbicacion", departamento, municipio,
                zona, direccion, referencia
         from ubicacion
         where id_ubicacion = $1`,
        [id]
    );

    return resultado.rows[0] || null;
}

export async function agregarUbicacion(
    ubicacion: Ubicacion
): Promise<Ubicacion> {
    const nuevaUbicacion = validarDatosUbicacion(ubicacion);

    const resultado = await pool.query<Ubicacion>(
        `insert into ubicacion (
            departamento, municipio, zona, direccion, referencia
         )
         values ($1, $2, $3, $4, $5)
         returning id_ubicacion as "idUbicacion", departamento, municipio,
                   zona, direccion, referencia`,
        [
            nuevaUbicacion.departamento,
            nuevaUbicacion.municipio,
            nuevaUbicacion.zona,
            nuevaUbicacion.direccion,
            nuevaUbicacion.referencia
        ]
    );

    return resultado.rows[0];
}

export async function actualizarUbicacion(
    id: number,
    datos: Ubicacion
): Promise<Ubicacion | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (datos.idUbicacion !== undefined && datos.idUbicacion !== id) {
        throw new Error("No se puede modificar el ID de la ubicación.");
    }

    const ubicacionActualizada = validarDatosUbicacion(datos);

    const resultado = await pool.query<Ubicacion>(
        `update ubicacion
         set departamento = $1, municipio = $2, zona = $3,
             direccion = $4, referencia = $5
         where id_ubicacion = $6
         returning id_ubicacion as "idUbicacion", departamento, municipio,
                   zona, direccion, referencia`,
        [
            ubicacionActualizada.departamento,
            ubicacionActualizada.municipio,
            ubicacionActualizada.zona,
            ubicacionActualizada.direccion,
            ubicacionActualizada.referencia,
            id
        ]
    );

    return resultado.rows[0] || null;
}

export async function eliminarUbicacion(
    id: number
): Promise<Ubicacion | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Ubicacion>(
        `delete from ubicacion
         where id_ubicacion = $1
         returning id_ubicacion as "idUbicacion", departamento, municipio,
                   zona, direccion, referencia`,
        [id]
    );

    return resultado.rows[0] || null;
}
