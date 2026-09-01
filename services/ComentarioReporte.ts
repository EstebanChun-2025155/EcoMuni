import { ComentarioReporte } from "../models/comentarioReporte";
import { validarComentarioReporte } from "../utils/Validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosComentario(
    comentario: ComentarioReporte
): ComentarioReporte {

    const errores = validarComentarioReporte(
        comentario.idReporte,
        comentario.idUsuario,
        comentario.comentario,
        comentario.estado
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...comentario,
        comentario: comentario.comentario.trim(),
        estado: comentario.estado.trim()
    };
}

export async function listarComentarios(): Promise<ComentarioReporte[]> {
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function buscarComentario(
    id: number
): Promise<ComentarioReporte> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function agregarComentario(
    comentario: ComentarioReporte
): Promise<ComentarioReporte> {

    const nuevoComentario =
        validarDatosComentario(comentario);

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function actualizarComentario(
    id: number,
    datos: ComentarioReporte
): Promise<ComentarioReporte> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (
        datos.idComentario !== undefined &&
        datos.idComentario !== id
    ) {
        throw new Error(
            "No se puede modificar el ID del comentario."
        );
    }

    const comentarioActualizado =
        validarDatosComentario(datos);

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function eliminarComentario(
    id: number
): Promise<ComentarioReporte> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}