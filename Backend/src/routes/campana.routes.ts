import { Router, Request, Response } from 'express';
import {
    listarCampanas,
    buscarCampana,
    agregarCampana,
    actualizarCampana,
    eliminarCampana
} from '../services/campana.service';

const router = Router();

router.get('/listarCampana', async (req: Request, res: Response) => {
    try {
        const campanas = await listarCampanas();
        res.json(campanas);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/buscarCampana/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const campana = await buscarCampana(id);
        res.json(campana);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/agregarCampana', async (req: Request, res: Response) => {
    try {
        const nueva = await agregarCampana(req.body);
        res.status(201).json(nueva);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/actualizarCampana/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const actualizada = await actualizarCampana(id, req.body);
        res.json(actualizada);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/eliminarCampana/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        await eliminarCampana(id);
        res.json({ mensaje: `Campaña con ID ${id} eliminada correctamente.` });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;