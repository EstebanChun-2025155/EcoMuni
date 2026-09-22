import { Router, Request, Response } from 'express';
import { listarPuntos, agregarPunto } from '../service/puntoReciclajeService';
import { nombreDepartamento } from '../config/departamentos';
import { ApiError } from '../utils/apiError';
import { responderError } from './respuestaError';

const router = Router();

// Acepta tanto el slug ("alta-verapaz") como el nombre ("Alta Verapaz").
function departamentoDe(valor: unknown): string {
    if (typeof valor !== 'string' || !valor.trim()) {
        throw new ApiError(400, 'El departamento es obligatorio.');
    }
    const limpio = valor.trim();
    try {
        return nombreDepartamento(limpio);
    } catch {
        return limpio;
    }
}

function fallar(res: Response, error: unknown): void {
    if (error instanceof ApiError) {
        res.status(error.status).json({ mensaje: error.message });
        return;
    }
    responderError(res, error);
}

router.get('/listarPunto', async (req: Request, res: Response) => {
    try {
        res.json(await listarPuntos(departamentoDe(req.query['departamento'])));
    } catch (error) {
        fallar(res, error);
    }
});

router.post('/agregarPunto', async (req: Request, res: Response) => {
    try {
        const origen = req.body?.['departamento'] ?? req.query['departamento'];
        const departamento = departamentoDe(origen);
        res.status(201).json(await agregarPunto(departamento, req.body));
    } catch (error) {
        fallar(res, error);
    }
});

export default router;
