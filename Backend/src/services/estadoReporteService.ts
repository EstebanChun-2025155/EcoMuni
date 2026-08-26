import { EstadoReporte } from "../models/estadoReporte";
import { validarEstadoReporte } from "../utils/validaciones/estadoReporte.validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosEstado(estado: EstadoReporte): EstadoReporte {
    if (estado.id_estado !== undefined && !validarId(estado.id_estado)) {
        throw new Error("ID de estado inválido.");
    }

    const errores = validarEstadoReporte(
        estado.nombre,
        estado.descripcion
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...estado,
        nombre: estado.nombre.trim(),
        descripcion: estado.descripcion?.trim() ?? null
    };
}

export async function listarEstadosReporte(): Promise<EstadoReporte[]> {
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function buscarEstadoReporte(id: number): Promise<EstadoReporte> {
    if (!validarId(id)) throw new Error("ID inválido.");
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function agregarEstadoReporte(estado: EstadoReporte): Promise<EstadoReporte> {
    const nuevoEstado = validarDatosEstado(estado);
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function actualizarEstadoReporte(id: number, datos: EstadoReporte): Promise<EstadoReporte> {
    if (!validarId(id)) throw new Error("ID inválido.");

    if (datos.id_estado !== undefined && datos.id_estado !== id) {
        throw new Error("No se puede modificar el ID del estado de reporte.");
    }

    const estadoActualizado = validarDatosEstado({ ...datos, id_estado: id });
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function eliminarEstadoReporte(id: number): Promise<EstadoReporte> {
    if (!validarId(id)) throw new Error("ID inválido.");
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}
