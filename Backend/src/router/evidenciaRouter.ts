import { Request, Response, Router } from "express";
import {
    actualizarEvidencia,
    agregarEvidencia,
    buscarEvidencia,
    eliminarEvidencia,
    listarEvidencias
} from "../service/evidenciaService";
import { responderError } from "./RespuestaError";

const evidenciaRouter = Router();

evidenciaRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await listarEvidencias());
    } catch (error) {
        responderError(res, error);
    }
});

evidenciaRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const evidencia = await buscarEvidencia(Number(req.params.id));

        if (!evidencia) {
            res.status(404).json({ mensaje: "Evidencia no encontrada." });
            return;
        }

        res.status(200).json(evidencia);
    } catch (error) {
        responderError(res, error);
    }
});

evidenciaRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).json(await agregarEvidencia(req.body));
    } catch (error) {
        responderError(res, error);
    }
});

evidenciaRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const evidencia = await actualizarEvidencia(Number(req.params.id), req.body);

        if (!evidencia) {
            res.status(404).json({ mensaje: "Evidencia no encontrada." });
            return;
        }

        res.status(200).json(evidencia);
    } catch (error) {
        responderError(res, error);
    }
});

evidenciaRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const evidencia = await eliminarEvidencia(Number(req.params.id));

        if (!evidencia) {
            res.status(404).json({ mensaje: "Evidencia no encontrada." });
            return;
        }

        res.status(200).json(evidencia);
    } catch (error) {
        responderError(res, error);
    }
});

export default evidenciaRouter;