export function validarPuntoReciclaje(
    nombre: string,
    materiales: string,
    estado: string,
    descripcion?: string | null,
    horario?: string | null,
    telefono?: string | null
): string[] {
    const errores: string[] = [];

    // Validar nombre
    if (!nombre || nombre.trim().length === 0) {
        errores.push("El nombre es obligatorio.");
    } else if (nombre.trim().length > 100) {
        errores.push("El nombre no puede superar los 100 caracteres.");
    }

    // Validar materiales
    if (!materiales || materiales.trim().length === 0) {
        errores.push("Los materiales son obligatorios.");
    } else if (materiales.trim().length > 200) {
        errores.push("Los materiales no pueden superar los 200 caracteres.");
    }

    // Validar estado
    if (!estado || estado.trim().length === 0) {
        errores.push("El estado es obligatorio.");
    } else if (estado !== "activo" && estado !== "inactivo") {
        errores.push("El estado debe ser 'activo' o 'inactivo'.");
    }

    // Validar descripción
    if (descripcion && descripcion.trim().length > 250) {
        errores.push("La descripción no puede superar los 250 caracteres.");
    }

    // Validar horario
    if (horario && horario.trim().length > 150) {
        errores.push("El horario no puede superar los 150 caracteres.");
    }

    // Validar teléfono
    if (telefono) {
        if (telefono.trim().length > 20) {
            errores.push("El teléfono no puede superar los 20 caracteres.");
        }
        if (!/^[0-9+ ]+$/.test(telefono.trim())) {
            errores.push("El teléfono solo debe contener números, espacios o el símbolo '+'.");
        }
    }

    return errores;
}
