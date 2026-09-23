import { Router } from 'express';
import { exigirSesion, exigirGestion } from '../middleware/autorizacion';
import { idParametro } from '../utils/apiError';
import { listarCampanas, leerFiltrosCampana, guardarCampana } from '../service/campanaService';

const router = Router();
router.use(exigirSesion);
router.get('/', async (req, res) => {
  res.json(await listarCampanas(res.locals.actor, leerFiltrosCampana(req.query)));
});
router.post('/', exigirGestion, async (req, res) => {
  res.status(201).json(await guardarCampana(req.body, res.locals.actor));
});
router.put('/:id', exigirGestion, async (req, res) => {
  res.json(await guardarCampana(req.body, res.locals.actor, idParametro(req.params.id)));
});
export default router;
