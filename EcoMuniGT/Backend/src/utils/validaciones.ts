export function validarRol(
    nombre: string,
    descripcion?: string | null
): string[] {

    const errores: string[] = [];

    if (!nombre || nombre.trim().length === 0) {
        errores.push("El nombre del rol es obligatorio.");
    } else if (nombre.trim().length > 45) {
        errores.push("El nombre del rol no puede superar los 45 caracteres.");
    }

    if (descripcion && descripcion.trim().length > 150) {
        errores.push("La descripción no puede superar los 150 caracteres.");
    }

    return errores;
}

export function validarUbicacion(
    departamento: string,
    municipio: string,
    zona?: string | null,
    direccion?: string | null,
    referencia?: string | null
): string[] {

    const errores: string[] = [];

    if (!departamento || departamento.trim().length === 0) {
        errores.push("El departamento es obligatorio.");
    } else if (departamento.trim().length > 60) {
        errores.push("El departamento no puede superar los 60 caracteres.");
    }

    if (!municipio || municipio.trim().length === 0) {
        errores.push("El municipio es obligatorio.");
    } else if (municipio.trim().length > 80) {
        errores.push("El municipio no puede superar los 80 caracteres.");
    }

    if (zona && zona.trim().length > 15) {
        errores.push("La zona no puede superar los 15 caracteres.");
    }

    if (direccion && direccion.trim().length > 200) {
        errores.push("La dirección no puede superar los 200 caracteres.");
    }

    if (referencia && referencia.trim().length > 200) {
        errores.push("La referencia no puede superar los 200 caracteres.");
    }

    return errores;
}

export function validarUsuario(
    idRol: number,
    nombres: string,
    apellidos: string,
    correo: string,
    contrasena?: string,
    telefono?: string | null,
    estado?: string,
    validarContrasena: boolean = true
): string[] {

    const errores: string[] = [];

    if (!idRol || !Number.isInteger(idRol) || idRol <= 0) {
        errores.push("El ID del rol debe ser un número entero válido.");
    }

    if (!nombres || nombres.trim().length === 0) {
        errores.push("Los nombres son obligatorios.");
    } else if (nombres.trim().length > 60) {
        errores.push("Los nombres no pueden superar los 60 caracteres.");
    }

    if (!apellidos || apellidos.trim().length === 0) {
        errores.push("Los apellidos son obligatorios.");
    } else if (apellidos.trim().length > 60) {
        errores.push("Los apellidos no pueden superar los 60 caracteres.");
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correo || correo.trim().length === 0) {
        errores.push("El correo es obligatorio.");
    } else if (correo.trim().length > 120) {
        errores.push("El correo no puede superar los 120 caracteres.");
    } else if (!regexCorreo.test(correo.trim())) {
        errores.push("El formato del correo electrónico no es válido.");
    }

    if (validarContrasena || contrasena) {
        if (!contrasena || contrasena.length === 0) {
            errores.push("La contraseña es obligatoria.");
        } else if (contrasena.length < 8) {
            errores.push("La contraseña debe tener al menos 8 caracteres.");
        } else if (!/[A-Z]/.test(contrasena)) {
            errores.push("La contraseña debe contener al menos una letra mayúscula.");
        } else if (!/[a-z]/.test(contrasena)) {
            errores.push("La contraseña debe contener al menos una letra minúscula.");
        } else if (!/[0-9]/.test(contrasena)) {
            errores.push("La contraseña debe contener al menos un número.");
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(contrasena)) {
            errores.push("La contraseña debe contener al menos un carácter especial.");
        }
    }

    if (telefono) {
        if (telefono.trim().length > 20) {
            errores.push("El teléfono no puede superar los 20 caracteres.");
        }

        if (!/^[0-9]+$/.test(telefono.trim())) {
            errores.push("El teléfono solo debe contener números.");
        }
    }

    if (estado !== "activo" && estado !== "suspendido") {
        errores.push("El estado debe ser activo o suspendido.");
    }

    return errores;
}

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