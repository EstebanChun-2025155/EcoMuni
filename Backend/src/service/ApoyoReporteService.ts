import type { Conexion } from '../config/transaccion';
import type { ApoyoReporte } from '../models/ApoyoReporte';

export async function cambiarApoyo(
  db: Conexion,
  apoyo: ApoyoReporte,
  activo: boolean,
): Promise<void> {
  if (activo) {
    await db.query(
      'INSERT INTO apoyoreporte (id_reporte, id_usuario) VALUES ($1, $2) ON CONFLICT (id_reporte, id_usuario) DO NOTHING',
      [apoyo.idReporte, apoyo.idUsuario],
    );
  } else {
    await db.query('DELETE FROM apoyoreporte WHERE id_reporte = $1 AND id_usuario = $2', [
      apoyo.idReporte,
      apoyo.idUsuario,
    ]);
  }
}
