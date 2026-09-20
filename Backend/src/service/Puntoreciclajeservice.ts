import { pool } from "../config/database";
import { transaccion } from "../config/transaccion";
import { agregarUbicacion } from "./ubicacionService";
import { datosUbicacion, objeto, texto } from "../utils/apiError";
import type { PuntoReciclaje } from "../models/puntoReciclaje";

export async function listarPuntos(departamento: string): Promise<PuntoReciclaje[]> {
    const result = await pool.query<PuntoReciclaje>(
        "SELECT p.id_punto AS \"idPunto\", p.nombre, p.materiales, p.descripcion, p.horario, p.telefono, concat_ws(', ', u.municipio, nullif(u.zona, ''), nullif(u.direccion, '')) AS ubicacion FROM puntoreciclaje p JOIN ubicacion u ON u.id_ubicacion = p.id_ubicacion WHERE lower(btrim(u.departamento)) = lower($1) AND p.estado = 'activo' ORDER BY p.nombre, p.id_punto",
        [departamento]
    );
    return result.rows;
}

export async function agregarPunto(departamento: string, entrada: unknown) {
    const data = objeto(entrada);
    const lugar = datosUbicacion(data, departamento);
    const nombre = texto(data, "nombre", 100);
    const materiales = texto(data, "materiales", 200);
    const descripcion = texto(data, "descripcion", 250, false);
    const horario = texto(data, "horario", 150, false);
    const telefono = texto(data, "telefono", 20, false);
    return transaccion(async db => {
        const ubicacion = await agregarUbicacion(lugar, db);
        const result = await db.query<{ id: number }>(
            "INSERT INTO puntoreciclaje (id_ubicacion, nombre, materiales, descripcion, horario, telefono, estado) VALUES ($1,$2,$3,$4,$5,$6,'activo') RETURNING id_punto AS id",
            [ubicacion.idUbicacion, nombre, materiales, descripcion || null, horario || null, telefono || null]
        );
        return result.rows[0];
    });
}