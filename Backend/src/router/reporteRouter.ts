import { Router } from 'express';
import { transaccion } from '../config/transaccion.js';
import {
  exigirSesion,
  exigirAdmin,
  puedeGestionar,
  type Actor,
} from '../middleware/autorizacion.js';
import { nombreDepartamento } from '../config/departamentos.js';
import { objeto, texto, entero, idParametro, ApiError } from '../utils/apiError.js';
import { agregarReporte, detalleReporte, comprobarReporte } from '../service/reporteService.js';
import { departamentoDeReporte, consultarReportes } from '../service/consultaService.js';
import { retirarArchivoEvidencia } from '../service/evidenciaService.js';

const router = Router();
router.use(exigirSesion);
router.get('/', async (req, res) => {
  res.json(await consultarReportes(idParametro(req.query.pagina ?? '1')));
});
router.get('/:id', async (req, res) => {
  const id = idParametro(req.params.id);
  res.json(await detalleReporte(await departamentoDeReporte(id), id, res.locals.actor));
});
router.post('/', async (req, res) => {
  const data = objeto(req.body);
  res
    .status(201)
    .json(await agregarReporte(nombreDepartamento(data.departamento), data, res.locals.actor));
});
router.put('/:id', async (req, res) => {
  const id = idParametro(req.params.id),
    departamento = await departamentoDeReporte(id),
    actor = res.locals.actor as Actor,
    data = objeto(req.body);
  const titulo = texto(data, 'titulo', 100),
    descripcion = texto(data, 'descripcion', 500),
    prioridad = texto(data, 'prioridad', 10),
    idCategoria = entero(data.idCategoria);
  if (!['baja', 'media', 'alta'].includes(prioridad))
    throw new ApiError(400, 'Prioridad inválida.');
  res.json(
    await transaccion(async (db) => {
      const actual = await comprobarReporte(db, departamento, id, true);
      if (actual.idUsuario !== actor.idUsuario && !puedeGestionar(actor))
        throw new ApiError(403, 'No puedes editar este reporte.');
      if (
        !(
          await db.query(
            "SELECT id_categoria FROM categoria WHERE id_categoria=$1 AND estado='activa' FOR SHARE",
            [idCategoria],
          )
        ).rows.length
      )
        throw new ApiError(400, 'Categoría no activa.');
      await db.query(
        'UPDATE reporte SET titulo=$1,descripcion=$2,prioridad=$3,id_categoria=$4,fecha_actualizacion=current_date WHERE id_reporte=$5',
        [titulo, descripcion, prioridad, idCategoria, id],
      );
      return { id };
    }),
  );
});
router.delete('/:id', exigirAdmin, async (req, res) => {
  const id = idParametro(req.params.id),
    departamento = await departamentoDeReporte(id);
  const archivos = await transaccion(async (db) => {
    await comprobarReporte(db, departamento, id, true);
    const result = await db.query<{ url: string }>(
      'SELECT url_imagen AS url FROM evidencia WHERE id_reporte=$1',
      [id],
    );
    await db.query('DELETE FROM reporte WHERE id_reporte=$1', [id]);
    return result.rows;
  });
  await Promise.all(archivos.map((a) => retirarArchivoEvidencia(a.url)));
  res.json({ id });
});
export default router;
