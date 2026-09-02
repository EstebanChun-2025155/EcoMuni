import bcrypt from "bcryptjs";
import { pool } from "../config/database";
import { Usuario } from "../models/usuario";
import { validarUsuario } from "../utils/validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

function validarDatosUsuario(
    usuario: Usuario,
    validarContrasena: boolean
): Usuario {
    const errores = validarUsuario(
        usuario.idRol,
        usuario.nombres,
        usuario.apellidos,
        usuario.correo,
        usuario.contrasena,
        usuario.telefono,
        usuario.estado,
        validarContrasena
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...usuario,
        nombres: usuario.nombres.trim(),
        apellidos: usuario.apellidos.trim(),
        correo: usuario.correo.trim().toLowerCase(),
        telefono: usuario.telefono?.trim() || null
    };
}

export async function listarUsuarios(): Promise<Usuario[]> {
    const resultado = await pool.query<Usuario>(
        `select id_usuario as "idUsuario", id_rol as "idRol", nombres,
                apellidos, correo, telefono, estado,
                fecha_registro as "fechaRegistro"
         from usuario
         order by id_usuario`
    );

    return resultado.rows;
}

export async function buscarUsuario(id: number): Promise<Usuario | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Usuario>(
        `select id_usuario as "idUsuario", id_rol as "idRol", nombres,
                apellidos, correo, telefono, estado,
                fecha_registro as "fechaRegistro"
         from usuario
         where id_usuario = $1`,
        [id]
    );

    return resultado.rows[0] || null;
}

export async function agregarUsuario(usuario: Usuario): Promise<Usuario> {
    const nuevoUsuario = validarDatosUsuario(usuario, true);
    const contrasenaCifrada = await bcrypt.hash(
        nuevoUsuario.contrasena as string,
        12
    );

    const resultado = await pool.query<Usuario>(
        `insert into usuario (
            id_rol, nombres, apellidos, correo, contrasena, telefono, estado
         )
         values ($1, $2, $3, $4, $5, $6, $7)
         returning id_usuario as "idUsuario", id_rol as "idRol", nombres,
                   apellidos, correo, telefono, estado,
                   fecha_registro as "fechaRegistro"`,
        [
            nuevoUsuario.idRol,
            nuevoUsuario.nombres,
            nuevoUsuario.apellidos,
            nuevoUsuario.correo,
            contrasenaCifrada,
            nuevoUsuario.telefono,
            nuevoUsuario.estado
        ]
    );

    return resultado.rows[0];
}

export async function actualizarUsuario(
    id: number,
    datos: Usuario
): Promise<Usuario | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    if (datos.idUsuario !== undefined && datos.idUsuario !== id) {
        throw new Error("No se puede modificar el ID del usuario.");
    }

    const usuarioActualizado = validarDatosUsuario(datos, false);
    let resultado;

    if (usuarioActualizado.contrasena) {
        const contrasenaCifrada = await bcrypt.hash(
            usuarioActualizado.contrasena,
            12
        );

        resultado = await pool.query<Usuario>(
            `update usuario
             set id_rol = $1, nombres = $2, apellidos = $3, correo = $4,
                 contrasena = $5, telefono = $6, estado = $7
             where id_usuario = $8
             returning id_usuario as "idUsuario", id_rol as "idRol", nombres,
                       apellidos, correo, telefono, estado,
                       fecha_registro as "fechaRegistro"`,
            [
                usuarioActualizado.idRol,
                usuarioActualizado.nombres,
                usuarioActualizado.apellidos,
                usuarioActualizado.correo,
                contrasenaCifrada,
                usuarioActualizado.telefono,
                usuarioActualizado.estado,
                id
            ]
        );
    } else {
        resultado = await pool.query<Usuario>(
            `update usuario
             set id_rol = $1, nombres = $2, apellidos = $3, correo = $4,
                 telefono = $5, estado = $6
             where id_usuario = $7
             returning id_usuario as "idUsuario", id_rol as "idRol", nombres,
                       apellidos, correo, telefono, estado,
                       fecha_registro as "fechaRegistro"`,
            [
                usuarioActualizado.idRol,
                usuarioActualizado.nombres,
                usuarioActualizado.apellidos,
                usuarioActualizado.correo,
                usuarioActualizado.telefono,
                usuarioActualizado.estado,
                id
            ]
        );
    }

    return resultado.rows[0] || null;
}

export async function eliminarUsuario(id: number): Promise<Usuario | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Usuario>(
        `delete from usuario
         where id_usuario = $1
         returning id_usuario as "idUsuario", id_rol as "idRol", nombres,
                   apellidos, correo, telefono, estado,
                   fecha_registro as "fechaRegistro"`,
        [id]
    );

    return resultado.rows[0] || null;
}
