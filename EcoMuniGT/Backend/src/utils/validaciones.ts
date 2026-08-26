import {Roles} from "../models/roles";

export function validarRol(
    nombre: string,
    descripcion?: string
): string[] {

    const errores: string[] = [];

    if (!nombre || nombre.trim().length === 0) {
        errores.push("El nombre del rol es obligatorio.");
    } else if (!Object.values(Roles).includes(nombre as Roles)) {
        errores.push("El rol debe ser Admin, Supervisor o Ciudadano.");
    }

    if (descripcion && descripcion.trim().length > 150) {
        errores.push("La descripción no puede superar los 150 caracteres.");
    }

    return errores;
}

export function validarUbicacion(
    departamento: string,
    municipio: string,
    zona?: string,
    direccion?: string,
    referencia?: string
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
        errores.push( "La dirección no puede superar los 200 caracteres.");
    }

    if (referencia && referencia.trim().length > 200) {
        errores.push(
            "La referencia no puede superar los 200 caracteres."
        );
    }

    return errores;
}

export function validarUsuario(
    id_rol: number,
    nombres: string,
    apellidos: string,
    correo: string,
    contrasena: string,
    telefono?: string
): string[] {

    const errores: string[] = [];

    if (!id_rol || !Number.isInteger(id_rol) || id_rol <= 0) {
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

    const regexCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correo || correo.trim().length === 0) {
        errores.push("El correo es obligatorio.");
    } else if (correo.trim().length > 120) {
        errores.push("El correo no puede superar los 120 caracteres.");
    } else if (!regexCorreo.test(correo.trim())) {
        errores.push("El formato del correo electrónico no es válido.");
    }

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

    if (telefono) {

        if (telefono.trim().length > 20) {
            errores.push("El teléfono no puede superar los 20 caracteres.");
        }

        if (!/^[0-9]+$/.test(telefono.trim())) {
            errores.push("El teléfono solo debe contener números.");
        }
    }

    return errores;
}
