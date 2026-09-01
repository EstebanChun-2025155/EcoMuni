export function validarRol(nombre?: string, descripcion?: string): string[] {
    const errores: string[] = [];

    if (!nombre || nombre.trim() === "") {
        errores.push("El nombre del rol es obligatorio.");
    }

    return errores;
}

export function validarCategoria(
    categoria?: string,
    descripcion?: string,
    estado?: string
): string[] {
    const errores: string[] = [];

    if (!categoria || categoria.trim() === "") {
        errores.push("El nombre de la categoría es obligatorio.");
    }

    if (!estado || estado.trim() === "") {
        errores.push("El estado de la categoría es obligatorio.");
    }

    return errores;
}

export function validarEvidencia(
    idReporte?: number,
    urlImagen?: string,
    descripcion?: string,
    fechaSubida?: Date
): string[] {
    const errores: string[] = [];

    if (!idReporte || !Number.isInteger(idReporte) || idReporte <= 0) {
        errores.push("El ID del reporte asociado es inválido.");
    }

    if (!urlImagen || urlImagen.trim() === "") {
        errores.push("La URL de la imagen es obligatoria.");
    }

    if (!fechaSubida || isNaN(new Date(fechaSubida).getTime())) {
        errores.push("La fecha de subida es inválida.");
    }

    return errores;
}

export function validarReporte(
    idUsuario?: number,
    idCategoria?: number,
    idUbicacion?: number,
    idEstado?: number,
    codigo?: string,
    titulo?: string,
    descripcion?: string,
    prioridad?: string,
    motivoRechazo?: string,
    fechaReporte?: Date,
    fechaActualizacion?: Date
): string[] {
    const errores: string[] = [];

    if (!idUsuario || !Number.isInteger(idUsuario) || idUsuario <= 0) {
        errores.push("El ID del usuario es inválido.");
    }

    if (!idCategoria || !Number.isInteger(idCategoria) || idCategoria <= 0) {
        errores.push("El ID de la categoría es inválido.");
    }

    if (!idUbicacion || !Number.isInteger(idUbicacion) || idUbicacion <= 0) {
        errores.push("El ID de la ubicación es inválido.");
    }

    if (!idEstado || !Number.isInteger(idEstado) || idEstado <= 0) {
        errores.push("El ID del estado es inválido.");
    }

    if (!codigo || codigo.trim() === "") {
        errores.push("El código del reporte es obligatorio.");
    }

    if (!titulo || titulo.trim() === "") {
        errores.push("El título del reporte es obligatorio.");
    }

    if (!descripcion || descripcion.trim() === "") {
        errores.push("La descripción del reporte es obligatoria.");
    }

    if (!prioridad || prioridad.trim() === "") {
        errores.push("La prioridad del reporte es obligatoria.");
    }

    if (!fechaReporte || isNaN(new Date(fechaReporte).getTime())) {
        errores.push("La fecha del reporte es inválida.");
    }

    if (!fechaActualizacion || isNaN(new Date(fechaActualizacion).getTime())) {
        errores.push("La fecha de actualización es inválida.");
    }

    return errores;
}