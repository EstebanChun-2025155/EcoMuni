import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { pool } from "../config/database";

export interface UsuarioSesion {
    idUsuario: number;
    idRol: number;
    nombres: string;
    apellidos: string;
    correo: string;
    estado: string;
}

interface Sesion {
    idUsuario: number;
    idRol: number;
    fechaCreacion: number;
}

const sesiones = new Map<string, Sesion>();

export async function iniciarSesion(
    correo: string,
    contrasena: string
): Promise<{ token: string; usuario: UsuarioSesion } | null> {

    const resultado = await pool.query(
        `
        SELECT
            id_usuario AS "idUsuario",
            id_rol AS "idRol",
            nombres,
            apellidos,
            correo,
            contrasena,
            estado
        FROM Usuario
        WHERE correo = $1
        `,
        [correo.trim().toLowerCase()]
    );

    if (resultado.rows.length === 0) {
        return null;
    }

    const usuario = resultado.rows[0];

    if (usuario.estado !== "activo") {
        return null;
    }

    const contrasenaCorrecta = await bcrypt.compare(
        contrasena,
        usuario.contrasena
    );

    if (!contrasenaCorrecta) {
        return null;
    }

    const token = randomBytes(32).toString("hex");

    sesiones.set(token, {
        idUsuario: usuario.idUsuario,
        idRol: usuario.idRol,
        fechaCreacion: Date.now()
    });

    return {
        token,
        usuario: {
            idUsuario: usuario.idUsuario,
            idRol: usuario.idRol,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            estado: usuario.estado
        }
    };
}

export async function obtenerUsuarioSesion(
    token: string
): Promise<UsuarioSesion | null> {

    const sesion = sesiones.get(token);

    if (!sesion) {
        return null;
    }

    const resultado = await pool.query(
        `
        SELECT
            id_usuario AS "idUsuario",
            id_rol AS "idRol",
            nombres,
            apellidos,
            correo,
            estado
        FROM Usuario
        WHERE id_usuario = $1
        `,
        [sesion.idUsuario]
    );

    if (resultado.rows.length === 0) {
        sesiones.delete(token);
        return null;
    }

    const usuario = resultado.rows[0];

    if (usuario.estado !== "activo") {
        sesiones.delete(token);
        return null;
    }

    return usuario;
}

export function obtenerSesion(token: string): Sesion | null {
    return sesiones.get(token) ?? null;
}

export function cerrarSesion(token: string): void {
    sesiones.delete(token);
}

export async function registrarUsuario(datos: {
    nombres: string;
    apellidos: string;
    correo: string;
    contrasena: string;
    telefono?: string;
}): Promise<number> {

    const resultadoRol = await pool.query(
        `
        SELECT id_rol
        FROM Rol
        WHERE nombre = 'Ciudadano'
        `
    );

    if (resultadoRol.rows.length === 0) {
        throw new Error("No existe el rol Ciudadano.");
    }

    const contrasenaHash = await bcrypt.hash(
        datos.contrasena,
        12
    );

    const resultado = await pool.query(
        `
        INSERT INTO Usuario (
            id_rol,
            nombres,
            apellidos,
            correo,
            contrasena,
            telefono
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_usuario AS "idUsuario"
        `,
        [
            resultadoRol.rows[0].id_rol,
            datos.nombres.trim(),
            datos.apellidos.trim(),
            datos.correo.trim().toLowerCase(),
            contrasenaHash,
            datos.telefono?.trim() || null
        ]
    );

    return resultado.rows[0].idUsuario;
}