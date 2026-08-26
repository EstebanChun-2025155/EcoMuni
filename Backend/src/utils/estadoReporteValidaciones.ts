export function validarEstadoReporte(
    nombre: string,
    descripcion?: string | null
): string[] {
    const errores: string[] = [];

    // Validar nombre
    if (!nombre || nombre.trim().length === 0) {
        errores.push("El nombre del estado es obligatorio.");
    } else if (nombre.trim().length > 30) {
        errores.push("El nombre del estado no puede superar los 30 caracteres.");
    }

    // Validar descripción
    if (descripcion && descripcion.trim().length > 150) {
        errores.push("La descripción no puede superar los 150 caracteres.");
    }

    return errores;
}