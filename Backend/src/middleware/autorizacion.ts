import type { RequestHandler } from 'express';
import { pool } from '../config/database';

export interface Actor {
  idUsuario: number;
  rol: string;
}

export function puedeGestionar(actor: Actor): boolean {
  return actor.rol === 'Admin' || actor.rol === 'Supervisor';
}

export const exigirSesion: RequestHandler = async (req, res, next) => {
  try {
    const idUsuario = req.session.idUsuario;
    if (!idUsuario) {
      res.status(401).json({ mensaje: 'Debes iniciar sesión.' });
      return;
    }
    const result = await pool.query<Actor>(
      'SELECT u.id_usuario AS "idUsuario", r.nombre AS rol FROM usuario u JOIN rol r ON r.id_rol = u.id_rol WHERE u.id_usuario = $1 AND u.estado = \'activo\'',
      [idUsuario],
    );
    if (!result.rows[0]) {
      res.status(401).json({ mensaje: 'Tu sesión ya no es válida.' });
      return;
    }
    res.locals.actor = result.rows[0];
    res.setHeader('Cache-Control', 'no-store');
    next();
  } catch (error) {
    next(error);
  }
};

export const exigirGestion: RequestHandler = (_req, res, next) => {
  if (!res.locals.actor || !puedeGestionar(res.locals.actor)) {
    res.status(403).json({ mensaje: 'Esta acción requiere un administrador o supervisor.' });
    return;
  }
  next();
};

export const exigirAdmin: RequestHandler = (_req, res, next) => {
  if (res.locals.actor?.rol !== 'Admin') {
    res.status(403).json({ mensaje: 'Esta acción requiere un administrador.' });
    return;
  }
  next();
};
