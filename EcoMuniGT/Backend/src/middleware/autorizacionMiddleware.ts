import { NextFunction, Request, Response } from "express";
import { pool } from "../config/database";

export function autorizar(...rolesPermitidos: string[]) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        if (!req.usuario) {
            res.status(401).json({
                mensaje: "Debes iniciar sesión para realizar esta operación."
            });
            return;
        }

        try {
            const resultado = await pool.query(
                `
                SELECT nombre
                FROM Rol
                WHERE id_rol = $1
                `,
                [req.usuario.idRol]
            );

            if (resultado.rows.length === 0) {
                res.status(403).json({
                    mensaje: "El usuario no tiene un rol válido."
                });
                return;
            }

            const rolUsuario = resultado.rows[0].nombre;

            if (!rolesPermitidos.includes(rolUsuario)) {
                res.status(403).json({
                    mensaje: "No tienes permisos para realizar esta operación."
                });
                return;
            }

            next();
        } catch (error) {
            console.error("Error al verificar permisos:", error);

            res.status(500).json({
                mensaje: "No fue posible verificar los permisos."
            });
        }
    };
}