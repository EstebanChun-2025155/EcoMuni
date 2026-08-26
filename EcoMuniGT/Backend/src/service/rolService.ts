import { Rol } from "../models/rol";
import { validarRol } from "../utils/Validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosRol(rol: Rol): Rol {

    if (!validarId(rol.idRol)) {
        throw new Error("ID inválido.");
    }

    const errores = validarRol(
        rol.nombre,
        rol.descripcion
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...rol,
        nombre: rol.nombre,
        descripcion: rol.descripcion?.trim()
    };
}

export async function listarRoles(): Promise<Rol[]> {
    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function buscarRol(id: number): Promise<Rol> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function agregarRol(rol: Rol): Promise<Rol> {

    const nuevoRol = validarDatosRol(rol);

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function actualizarRol(
    id: number,
    datos: Rol
): Promise<Rol> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (datos.idRol !== id) {
        throw new Error(
            "No se puede modificar el ID del rol."
        );
    }

    const rolActualizado = validarDatosRol(datos);

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}

export async function eliminarRol(
    id: number
): Promise<Rol> {

    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    throw new Error("Conexión con PostgreSQL aún no configurada.");
}