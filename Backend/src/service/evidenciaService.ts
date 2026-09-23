import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { pool } from '../config/database';
import { transaccion } from '../config/transaccion';
import { ApiError, objeto, texto, entero } from '../utils/apiError';
import { puedeGestionar, type Actor } from '../middleware/autorizacion';
import type { Evidencia } from '../models/evidencia';

export const carpetaEvidencias = path.resolve(
  process.env.EVIDENCE_DIR || path.join(__dirname, '../../storage/evidencias'),
);
export const maximoImagen = 5 * 1024 * 1024;

export function extensionImagen(data: unknown, tipo: string | undefined): string {
  if (!Buffer.isBuffer(data) || data.length === 0 || data.length > maximoImagen)
    throw new ApiError(400, 'Selecciona una imagen de hasta 5 MB.');
  if (
    tipo === 'image/png' &&
    data.length >= 24 &&
    data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
    data.toString('ascii', 12, 16) === 'IHDR'
  )
    return 'png';
  if (
    tipo === 'image/jpeg' &&
    data.length >= 4 &&
    data[0] === 255 &&
    data[1] === 216 &&
    data[2] === 255 &&
    data[data.length - 2] === 255 &&
    data[data.length - 1] === 217
  )
    return 'jpg';
  if (
    tipo === 'image/webp' &&
    data.length >= 20 &&
    data.toString('ascii', 0, 4) === 'RIFF' &&
    data.toString('ascii', 8, 12) === 'WEBP'
  )
    return 'webp';
  throw new ApiError(
    415,
    'Solo se admiten imágenes PNG, JPEG y WebP; el contenido debe coincidir con su formato.',
  );
}

export async function listarEvidencias(idReporte: number): Promise<Evidencia[]> {
  const result = await pool.query<Evidencia>(
    'SELECT id_evidencia AS "idEvidencia", url_imagen AS "urlImagen", descripcion FROM evidencia WHERE id_reporte=$1 ORDER BY id_evidencia',
    [idReporte],
  );
  return result.rows;
}

export async function agregarEvidencia(
  departamento: string,
  idReporte: number,
  data: unknown,
  tipo: string | undefined,
  actor: Actor,
  descripcionEntrada: unknown = undefined,
) {
  const descripcion = texto({ descripcion: descripcionEntrada }, 'descripcion', 150, false);
  const extension = extensionImagen(data, tipo);
  const nombre = randomUUID() + '.' + extension;
  const archivo = path.join(carpetaEvidencias, nombre);
  let escrito = false;
  try {
    return await transaccion(async (db) => {
      const reporte = await db.query<{ idUsuario: number }>(
        'SELECT r.id_usuario AS "idUsuario" FROM reporte r JOIN ubicacion u ON u.id_ubicacion=r.id_ubicacion WHERE r.id_reporte=$1 AND lower(btrim(u.departamento))=lower($2) FOR UPDATE OF r',
        [idReporte, departamento],
      );
      if (!reporte.rows[0]) throw new ApiError(404, 'El reporte no existe en este departamento.');
      if (reporte.rows[0].idUsuario !== actor.idUsuario && !puedeGestionar(actor))
        throw new ApiError(403, 'Solo el autor o un supervisor puede adjuntar evidencias.');
      const cantidad = await db.query<{ total: number }>(
        'SELECT count(*)::integer AS total FROM evidencia WHERE id_reporte=$1',
        [idReporte],
      );
      if (cantidad.rows[0].total >= 5)
        throw new ApiError(409, 'Cada reporte admite un máximo de cinco evidencias.');
      await mkdir(carpetaEvidencias, { recursive: true });
      await writeFile(archivo, data as Buffer, { flag: 'wx' });
      escrito = true;
      const result = await db.query<{ id: number }>(
        'INSERT INTO evidencia (id_reporte,url_imagen,descripcion) VALUES ($1,$2,$3) RETURNING id_evidencia AS id',
        [idReporte, '/api/archivos/' + nombre, descripcion || null],
      );
      return result.rows[0];
    });
  } catch (error) {
    if (escrito) await unlink(archivo).catch(() => undefined);
    throw error;
  }
}

export async function describirEvidencia(
  departamento: string,
  idReporte: number,
  idEvidencia: number,
  entrada: unknown,
  actor: Actor,
) {
  const descripcion = texto(objeto(entrada), 'descripcion', 150, false);
  return transaccion(async (db) => {
    const reporte = await db.query<{ idUsuario: number }>(
      'SELECT r.id_usuario AS "idUsuario" FROM reporte r JOIN ubicacion u ON u.id_ubicacion=r.id_ubicacion WHERE r.id_reporte=$1 AND lower(btrim(u.departamento))=lower($2) FOR UPDATE OF r',
      [idReporte, departamento],
    );
    if (!reporte.rows[0]) throw new ApiError(404, 'El reporte no existe en este departamento.');
    if (reporte.rows[0].idUsuario !== actor.idUsuario && !puedeGestionar(actor))
      throw new ApiError(403, 'Solo el autor o un supervisor puede describir evidencias.');
    const result = await db.query<{ id: number }>(
      'UPDATE evidencia SET descripcion=$1 WHERE id_evidencia=$2 AND id_reporte=$3 RETURNING id_evidencia AS id',
      [descripcion || null, entero(idEvidencia), idReporte],
    );
    if (!result.rows[0]) throw new ApiError(404, 'La evidencia no pertenece a este reporte.');
    return result.rows[0];
  });
}

export async function retirarArchivoEvidencia(url: string): Promise<void> {
  const nombre = url.startsWith('/api/archivos/') ? url.slice('/api/archivos/'.length) : '';
  if (!/^[0-9a-f-]+\.(png|jpg|webp)$/i.test(nombre)) return;
  await unlink(path.join(carpetaEvidencias, nombre)).catch((error) => {
    if (error?.code !== 'ENOENT') console.error('No fue posible retirar un archivo de evidencia.');
  });
}
