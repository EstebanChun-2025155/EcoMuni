import { PuntoReciclaje } from "../models/puntoReciclaje";
import { validarPuntoReciclaje } from "../utils/Validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosPunto(punto: PuntoReciclaje): PuntoReciclaje {
    if (punto.id_punto !== undefined && !validarId(punto.id_punto)) {
        throw new Error("ID de punto inválido.");
    }

    if (!validarId(punto.id_ubicacion)) {
        throw new Error("ID de ubicación inválido.");
    }

    const errores = validarPuntoReciclaje(
        punto.nombre,
        punto.materiales,
        punto.estado,
        punto.descripcion,
        punto.horario,
        punto.telefono
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...punto,
        nombre: punto.nombre.trim(),
        materiales: punto.materiales.trim(),
        descripcion: punto.descripcion?.trim() ?? null,
        horario: punto.horario?.trim() ?? null,
        telefono: punto.telefono?.trim() ?? null,
        estado: punto.estado
    };
}

export async function listarPuntosReciclaje(): Promise<PuntoReciclaje[]> {
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function buscarPuntoReciclaje(id: number): Promise<PuntoReciclaje> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function agregarPuntoReciclaje(punto: PuntoReciclaje): Promise<PuntoReciclaje> {
    const nuevoPunto = validarDatosPunto(punto);
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function actualizarPuntoReciclaje(
    id: number,
    datos: PuntoReciclaje
): Promise<PuntoReciclaje> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (datos.id_punto !== undefined && datos.id_punto !== id) {
        throw new Error("No se puede modificar el ID del punto de reciclaje.");
    }

    const puntoActualizado = validarDatosPunto({ ...datos, id_punto: id });
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function eliminarPuntoReciclaje(id: number): Promise<PuntoReciclaje> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}
