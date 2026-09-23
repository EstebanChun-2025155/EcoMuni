import { pool } from '../config/database';
import type { Conexion } from '../config/transaccion';
import { puedeGestionar, type Actor } from '../middleware/autorizacion';
import { slugDepartamento } from './consultaService';
import type { Seguimiento, SeguimientoReporte } from '../models/Seguimiento';

export async function listarSeguimientos(idReporte: number): Promise<Seguimiento[]> {
  const result = await pool.query<Seguimiento>(
    'SELECT s.id_seguimiento AS "idSeguimiento", s.id_estado AS "idEstado", e.nombre AS estado, concat_ws(\' \', u.nombres, u.apellidos) AS autor, to_char(s.fecha_cambio, \'DD/MM/YYYY\') AS fecha, s.observacion FROM seguimiento s JOIN estadoreporte e ON e.id_estado = s.id_estado JOIN usuario u ON u.id_usuario = s.id_usuario WHERE s.id_reporte = $1 ORDER BY s.id_seguimiento',
    [idReporte],
  );
  return result.rows;
}

export async function agregarSeguimiento(
  db: Conexion,
  idReporte: number,
  idUsuario: number,
  idEstado: number,
  observacion: string,
): Promise<void> {
  await db.query(
    'INSERT INTO seguimiento (id_reporte, id_usuario, id_estado, observacion) VALUES ($1, $2, $3, $4)',
    [idReporte, idUsuario, idEstado, observacion],
  );
}

export async function listarSeguimientosVisibles(actor: Actor): Promise<SeguimientoReporte[]> {
  const esGestion = puedeGestionar(actor);
  const filtro = esGestion ? 'TRUE' : 'r.id_usuario = $1';
  const parametros = esGestion ? [] : [actor.idUsuario];
  const result = await pool.query<Omit<SeguimientoReporte, 'slug'>>(
    'SELECT s.id_seguimiento AS "idSeguimiento", r.id_reporte AS "idReporte", r.titulo, u.departamento, e.nombre AS estado, s.observacion, to_char(s.fecha_cambio, \'DD/MM/YYYY\') AS fecha FROM seguimiento s JOIN reporte r ON r.id_reporte = s.id_reporte JOIN ubicacion u ON u.id_ubicacion = r.id_ubicacion JOIN estadoreporte e ON e.id_estado = s.id_estado WHERE ' +
      filtro +
      ' ORDER BY s.id_seguimiento DESC LIMIT 100',
    parametros,
  );
  return result.rows.map((fila) => ({ ...fila, slug: slugDepartamento(fila.departamento) }));
}
