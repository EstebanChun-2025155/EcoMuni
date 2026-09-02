import { Router, Request, Response } from 'express';
import { listarPuntos, buscarPunto, agregarPunto, actualizarPunto, eliminarPunto } from '../services/puntoReciclaje.service';

const router = Router();

router.get('/listarPunto', async (req: Request, res: Response) => {
    try {
        const puntos = await listarPuntos();
        res.json(puntos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/buscarPunto/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const punto = await buscarPunto(id);
        res.json(punto);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/agregarPunto', async (req: Request, res: Response) => {
    try {
        const nuevo = await agregarPunto(req.body);
        res.status(201).json(nuevo);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/actualizarPunto/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const actualizado = await actualizarPunto(id, req.body);
        res.json(actualizado);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/eliminarPunto/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        await eliminarPunto(id);
        res.json({ mensaje: `Punto de reciclaje con ID ${id} eliminado correctamente.` });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
