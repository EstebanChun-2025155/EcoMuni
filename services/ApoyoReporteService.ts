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
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function buscarApoyo(
    id: number
): Promise<ApoyoReporte> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function agregarApoyo(
    apoyo: ApoyoReporte
): Promise<ApoyoReporte> {

    const nuevoApoyo = validarDatosApoyo(apoyo);

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function actualizarApoyo(
    id: number,
    datos: ApoyoReporte
): Promise<ApoyoReporte> {

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

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function eliminarApoyo(
    id: number
): Promise<ApoyoReporte> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}