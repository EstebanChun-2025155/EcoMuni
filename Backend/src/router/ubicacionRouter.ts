import { Request, Response, Router } from "express";
import { actualizarUbicacion, agregarUbicacion, buscarUbicacion, eliminarUbicacion, listarUbicaciones } from "../service/ubicacionService";
import { responderError } from "./respuestaError";

const ubicacionRouter = Router();

ubicacionRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await listarUbicaciones());
    } catch (error) {
        responderError(res, error);
    }
});

ubicacionRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const ubicacion = await buscarUbicacion(Number(req.params.id));

        if (!ubicacion) {
            res.status(404).json({ mensaje: "Ubicación no encontrada." });
            return;
        }

        res.status(200).json(ubicacion);
    } catch (error) {
        responderError(res, error);
    }
});

ubicacionRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).json(await agregarUbicacion(req.body));
    } catch (error) {
        responderError(res, error);
    }
});

ubicacionRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const ubicacion = await actualizarUbicacion(Number(req.params.id), req.body);

        if (!ubicacion) {
            res.status(404).json({ mensaje: "Ubicación no encontrada." });
            return;
        }

        res.status(200).json(ubicacion);
    } catch (error) {
        responderError(res, error);
    }
});

ubicacionRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const ubicacion = await eliminarUbicacion(Number(req.params.id));

        if (!ubicacion) {
            res.status(404).json({ mensaje: "Ubicación no encontrada." });
            return;
        }

        res.status(200).json(ubicacion);
    } catch (error) {
        responderError(res, error);
    }
});

export default ubicacionRouter;