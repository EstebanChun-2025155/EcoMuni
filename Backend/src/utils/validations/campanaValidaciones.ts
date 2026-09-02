export function validarCampana(
    titulo: string,
    descripcion: string,
    organizador: string,
    fecha_inicio: string | Date,
    fecha_fin: string | Date,
    estado: string,
    imagen_url?: string | null
): string[] {
    const errores: string[] = [];

    // Validar título
    if (!titulo || titulo.trim().length === 0) {
        errores.push("El título es obligatorio.");
    } else if (titulo.trim().length > 100) {
        errores.push("El título no puede superar los 100 caracteres.");
    }

    // Validar descripción
    if (!descripcion || descripcion.trim().length === 0) {
        errores.push("La descripción es obligatoria.");
    } else if (descripcion.trim().length > 500) {
        errores.push("La descripción no puede superar los 500 caracteres.");
    }

    // Validar organizador
    if (!organizador || organizador.trim().length === 0) {
        errores.push("El organizador es obligatorio.");
    } else if (organizador.trim().length > 100) {
        errores.push("El organizador no puede superar los 100 caracteres.");
    }

    // Validar fechas
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);

    if (isNaN(inicio.getTime())) {
        errores.push("La fecha de inicio no es válida.");
    }
    if (isNaN(fin.getTime())) {
        errores.push("La fecha de fin no es válida.");
    }
    if (!isNaN(inicio.getTime()) && !isNaN(fin.getTime()) && inicio > fin) {
        errores.push("La fecha de inicio no puede ser posterior a la fecha de fin.");
    }

    // Validar estado
    const estadosPermitidos = ["borrador", "publicada", "finalizada", "cancelada"];
    if (!estado || estado.trim().length === 0) {
        errores.push("El estado de la campaña es obligatorio.");
    } else if (!estadosPermitidos.includes(estado)) {
        errores.push("El estado debe ser 'borrador', 'publicada', 'finalizada' o 'cancelada'.");
    }

    // Validar imagen_url
    if (imagen_url && imagen_url.trim().length > 300) {
        errores.push("La URL de la imagen no puede superar los 300 caracteres.");
    }

    return errores;
}