import { Router } from 'express';
import { exigirSesion, type Actor } from '../middleware/autorizacion.js';
import { listarSeguimientosVisibles } from '../service/SeguimientoService.js';

const router = Router();
router.use(exigirSesion);
router.get('/', async (_req, res) => {
  res.json(await listarSeguimientosVisibles(res.locals.actor as Actor));
});
export default router;
