import { Seguimiento } from "../models/Seguimiento";
import { validarSeguimiento } from "../utils/Validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosSeguimiento(
    seguimiento: Seguimiento
): Seguimiento {

    const errores = validarSeguimiento(
        seguimiento.idReporte,
        seguimiento.idUsuario,
        seguimiento.idEstado,
        seguimiento.observacion
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...seguimiento,
        observacion: seguimiento.observacion?.trim()
    };
}

export async function listarSeguimientos(): Promise<Seguimiento[]> {
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function buscarSeguimiento(
    id: number
): Promise<Seguimiento> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function agregarSeguimiento(
    seguimiento: Seguimiento
): Promise<Seguimiento> {

    const nuevoSeguimiento =
        validarDatosSeguimiento(seguimiento);

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function actualizarSeguimiento(
    id: number,
    datos: Seguimiento
): Promise<Seguimiento> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (
        datos.idSeguimiento !== undefined &&
        datos.idSeguimiento !== id
    ) {
        throw new Error(
            "No se puede modificar el ID del seguimiento."
        );
    }

    const seguimientoActualizado =
        validarDatosSeguimiento(datos);

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function eliminarSeguimiento(
    id: number
): Promise<Seguimiento> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}