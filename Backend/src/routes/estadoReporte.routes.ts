import { Router, Request, Response } from 'express';
import { listarEstados, buscarEstado, agregarEstado, actualizarEstado, eliminarEstado } from '../services/estadoReporte.service';

const router = Router();

router.get('/listarEstado', async (req: Request, res: Response) => {
    try {
        const estados = await listarEstados();
        res.json(estados);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/buscarEstado/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const estado = await buscarEstado(id);
        res.json(estado);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/agregarEstado', async (req: Request, res: Response) => {
    try {
        const nuevo = await agregarEstado(req.body);
        res.status(201).json(nuevo);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/actualizarEstado/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const actualizado = await actualizarEstado(id, req.body);
        res.json(actualizado);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/eliminarEstado/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        await eliminarEstado(id);
        res.json({ mensaje: `Estado con ID ${id} eliminado correctamente.` });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
