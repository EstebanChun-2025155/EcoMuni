import { Router, raw } from 'express';
import { pool } from '../config/database.js';
import { exigirSesion, puedeGestionar, type Actor } from '../middleware/autorizacion.js';
import { transaccion } from '../config/transaccion.js';
import { idParametro, ApiError } from '../utils/apiError.js';
import { departamentoDeReporte, consultarEvidencias } from '../service/consultaService.js';
import {
  agregarEvidencia,
  describirEvidencia,
  maximoImagen,
  retirarArchivoEvidencia,
} from '../service/evidenciaService.js';
import { comprobarReporte } from '../service/reporteService.js';

const router = Router();
router.use(exigirSesion);
async function referencia(id: number) {
  const r = await pool.query<{ idReporte: number }>(
    'SELECT id_reporte AS "idReporte" FROM evidencia WHERE id_evidencia=$1',
    [id],
  );
  if (!r.rows[0]) throw new ApiError(404, 'Evidencia no encontrada.');
  return {
    idReporte: r.rows[0].idReporte,
    departamento: await departamentoDeReporte(r.rows[0].idReporte),
  };
}
router.get('/', async (req, res) => {
  res.json(await consultarEvidencias(idParametro(req.query.pagina ?? '1')));
});
router.get('/:id', async (req, res) => {
  const id = idParametro(req.params.id);
  await referencia(id);
  const result = await pool.query(
    'SELECT id_evidencia AS "idEvidencia",id_reporte AS "idReporte",url_imagen AS "urlImagen",descripcion,fecha_subida AS "fechaSubida" FROM evidencia WHERE id_evidencia=$1',
    [id],
  );
  if (!result.rows[0]) throw new ApiError(404, 'Evidencia no encontrada.');
  res.json(result.rows[0]);
});
router.post(
  '/',
  raw({ type: ['image/png', 'image/jpeg', 'image/webp'], limit: maximoImagen }),
  async (req, res) => {
    const idReporte = idParametro(req.query.idReporte);
    res
      .status(201)
      .json(
        await agregarEvidencia(
          await departamentoDeReporte(idReporte),
          idReporte,
          req.body,
          req.get('Content-Type')?.split(';')[0],
          res.locals.actor,
          req.query.descripcion,
        ),
      );
  },
);
router.put('/:id', async (req, res) => {
  const id = idParametro(req.params.id),
    r = await referencia(id);
  res.json(await describirEvidencia(r.departamento, r.idReporte, id, req.body, res.locals.actor));
});
router.delete('/:id', async (req, res) => {
  const id = idParametro(req.params.id),
    r = await referencia(id),
    actor = res.locals.actor as Actor;
  const archivo = await transaccion(async (db) => {
    const reporte = await comprobarReporte(db, r.departamento, r.idReporte, true);
    if (reporte.idUsuario !== actor.idUsuario && !puedeGestionar(actor))
      throw new ApiError(403, 'No puedes eliminar esta evidencia.');
    const result = await db.query<{ url: string }>(
      'DELETE FROM evidencia WHERE id_evidencia=$1 AND id_reporte=$2 RETURNING url_imagen AS url',
      [id, r.idReporte],
    );
    if (!result.rows[0]) throw new ApiError(404, 'Evidencia no encontrada.');
    return result.rows[0].url;
  });
  await retirarArchivoEvidencia(archivo);
  res.json({ id });
});
export default router;
