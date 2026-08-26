import { Campana } from "../models/campana";
import { validarCampana } from "../utils/Validaciones";

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
        campana.estado,
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
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function buscarCampana(id: number): Promise<Campana> {
    if (!validarId(id)) throw new Error("ID inválido.");
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function agregarCampana(campana: Campana): Promise<Campana> {
    const nuevaCampana = validarDatosCampana(campana);
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function actualizarCampana(id: number, datos: Campana): Promise<Campana> {
    if (!validarId(id)) throw new Error("ID inválido.");

    if (datos.id_campana !== undefined && datos.id_campana !== id) {
        throw new Error("No se puede modificar el ID de la campaña.");
    }

    const campanaActualizada = validarDatosCampana({ ...datos, id_campana: id });
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function eliminarCampana(id: number): Promise<Campana> {
    if (!validarId(id)) throw new Error("ID inválido.");
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}
