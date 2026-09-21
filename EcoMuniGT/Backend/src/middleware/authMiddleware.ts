import { NextFunction, Request, Response } from "express";
import { obtenerSesion } from "../service/AuthService";

export interface UsuarioAutenticado {
    idUsuario: number;
    idRol: number;
}

declare global {
    namespace Express {
        interface Request {
            usuario?: UsuarioAutenticado;
        }
    }
}

function obtenerToken(req: Request): string | null {
    const cookies = req.headers.cookie;

    if (!cookies) {
        return null;
    }

    const cookie = cookies
        .split(";")
        .map(valor => valor.trim())
        .find(valor => valor.startsWith("ecomuni_token="));

    if (!cookie) {
        return null;
    }

    return decodeURIComponent(
        cookie.substring("ecomuni_token=".length)
    );
}

export function autenticar(
    req: Request,
    res: Response,
    next: NextFunction
): void {

    const token = obtenerToken(req);

    if (!token) {
        res.status(401).json({
            mensaje: "Debes iniciar sesión para realizar esta operación."
        });
        return;
    }

    const sesion = obtenerSesion(token);

    if (!sesion) {
        res.status(401).json({
            mensaje: "La sesión no es válida o ha expirado."
        });
        return;
    }

    req.usuario = {
        idUsuario: sesion.idUsuario,
        idRol: sesion.idRol
    };

    next();
}