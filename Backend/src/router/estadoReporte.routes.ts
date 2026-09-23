import { Request, Response, Router } from 'express';
import { exigirGestion, exigirSesion } from '../middleware/autorizacion';
import {
  agregarEstado,
  actualizarEstado,
  buscarEstado,
  eliminarEstado,
  listarEstados,
} from '../service/estadoReporteService';
import { idParametro } from '../utils/apiError';
import { responderError } from './respuestaError';

const estadoReporteRouter = Router();

estadoReporteRouter.use(exigirSesion);

estadoReporteRouter.get('/listarEstado', async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await listarEstados());
  } catch (error) {
    responderError(res, error);
  }
});

estadoReporteRouter.get('/buscarEstado/:id', async (req: Request, res: Response) => {
  try {
    const estado = await buscarEstado(idParametro(req.params.id));
    if (!estado) {
      res.status(404).json({ mensaje: 'Estado no encontrado.' });
      return;
    }
    res.status(200).json(estado);
  } catch (error) {
    responderError(res, error);
  }
});

estadoReporteRouter.post('/agregarEstado', exigirGestion, async (req: Request, res: Response) => {
  try {
    res.status(201).json(await agregarEstado(req.body));
  } catch (error) {
    responderError(res, error);
  }
});

estadoReporteRouter.put(
  '/actualizarEstado/:id',
  exigirGestion,
  async (req: Request, res: Response) => {
    try {
      const estado = await actualizarEstado(idParametro(req.params.id), req.body);
      if (!estado) {
        res.status(404).json({ mensaje: 'Estado no encontrado.' });
        return;
      }
      res.status(200).json(estado);
    } catch (error) {
      responderError(res, error);
    }
  },
);

estadoReporteRouter.delete(
  '/eliminarEstado/:id',
  exigirGestion,
  async (req: Request, res: Response) => {
    try {
      const estado = await eliminarEstado(idParametro(req.params.id));
      if (!estado) {
        res.status(404).json({ mensaje: 'Estado no encontrado.' });
        return;
      }
      res
        .status(200)
        .json({ mensaje: `Estado con ID ${estado.idEstado} eliminado correctamente.` });
    } catch (error) {
      responderError(res, error);
    }
  },
);

export default estadoReporteRouter;
