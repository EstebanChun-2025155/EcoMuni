export function validarApoyoReporte(
    idReporte: number,
    idUsuario: number
): string[] {

    const errores: string[] = [];

    if (!idReporte || !Number.isInteger(idReporte) || idReporte <= 0) {
        errores.push("El ID del reporte debe ser válido.");
    }

    if (!idUsuario || !Number.isInteger(idUsuario) || idUsuario <= 0) {
        errores.push("El ID del usuario debe ser válido.");
    }

    return errores;
}

export function validarComentarioReporte(
    idReporte: number,
    idUsuario: number,
    comentario: string,
    estado: string
): string[] {

    const errores: string[] = [];

    if (!idReporte || !Number.isInteger(idReporte) || idReporte <= 0) {
        errores.push("El ID del reporte debe ser válido.");
    }

    if (!idUsuario || !Number.isInteger(idUsuario) || idUsuario <= 0) {
        errores.push("El ID del usuario debe ser válido.");
    }

    if (!comentario || comentario.trim().length === 0) {
        errores.push("El comentario es obligatorio.");
    } else if (comentario.trim().length > 500) {
        errores.push("El comentario no puede superar los 500 caracteres.");
    }

    if (
        estado !== "visible" &&
        estado !== "oculto"
    ) {
        errores.push("El estado debe ser visible u oculto.");
    }

    return errores;
}

export function validarSeguimiento(
    idReporte: number,
    idUsuario: number,
    idEstado: number,
    observacion: string | undefined
): string[] {

    const errores: string[] = [];

    if (!idReporte || !Number.isInteger(idReporte) || idReporte <= 0) {
        errores.push("El ID del reporte debe ser válido.");
    }

    if (!idUsuario || !Number.isInteger(idUsuario) || idUsuario <= 0) {
        errores.push("El ID del usuario debe ser válido.");
    }

    if (!idEstado || !Number.isInteger(idEstado) || idEstado <= 0) {
        errores.push("El ID del estado debe ser válido.");
    }

    if (observacion && observacion.trim().length > 500) {
        errores.push("La observación no puede superar los 500 caracteres.");
    }

    return errores;
}