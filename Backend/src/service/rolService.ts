import { pool } from "../config/database";
import { Rol } from "../models/rol";
import { validarRol } from "../utils/validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosRol(rol: Rol): Rol {
    const errores = validarRol(
        rol.nombre,
        rol.descripcion
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...rol,
        nombre: rol.nombre.trim(),
        descripcion: rol.descripcion?.trim() || null
    };
}

export async function listarRoles(): Promise<Rol[]> {
    const resultado = await pool.query<Rol>(
        `select id_rol as "idRol", nombre, descripcion
         from rol
         order by id_rol`
    );

    return resultado.rows;
}

export async function buscarRol(id: number): Promise<Rol | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Rol>(
        `select id_rol as "idRol", nombre, descripcion
         from rol
         where id_rol = $1`,
        [id]
    );

    return resultado.rows[0] || null;
}

export async function agregarRol(rol: Rol): Promise<Rol> {
    const nuevoRol = validarDatosRol(rol);

    const resultado = await pool.query<Rol>(
        `insert into rol (nombre, descripcion)
         values ($1, $2)
         returning id_rol as "idRol", nombre, descripcion`,
        [nuevoRol.nombre, nuevoRol.descripcion]
    );

    return resultado.rows[0];
}

export async function actualizarRol(
    id: number,
    datos: Rol
): Promise<Rol | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (datos.idRol !== undefined && datos.idRol !== id) {
        throw new Error("No se puede modificar el ID del rol.");
    }

    const rolActualizado = validarDatosRol(datos);

    const resultado = await pool.query<Rol>(
        `update rol
         set nombre = $1, descripcion = $2
         where id_rol = $3
         returning id_rol as "idRol", nombre, descripcion`,
        [rolActualizado.nombre, rolActualizado.descripcion, id]
    );

    return resultado.rows[0] || null;
}

export async function eliminarRol(id: number): Promise<Rol | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Rol>(
        `delete from rol
         where id_rol = $1
         returning id_rol as "idRol", nombre, descripcion`,
        [id]
    );

    return resultado.rows[0] || null;
}
