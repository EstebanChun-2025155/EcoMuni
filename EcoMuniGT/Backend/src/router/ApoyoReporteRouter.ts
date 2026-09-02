import { Request, Response, Router } from "express";
import {
    actualizarApoyo,
    agregarApoyo,
    buscarApoyo,
    eliminarApoyo,
    listarApoyos
} from "../service/apoyoReporteService";
import { responderError } from "./respuestaError";

const apoyoReporteRouter = Router();

apoyoReporteRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await listarApoyos());
    } catch (error) {
        responderError(res, error);
    }
});

apoyoReporteRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const apoyo = await buscarApoyo(Number(req.params.id));

        if (!apoyo) {
            res.status(404).json({ mensaje: "Apoyo no encontrado." });
            return;
        }

        res.status(200).json(apoyo);
    } catch (error) {
        responderError(res, error);
    }
});

apoyoReporteRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).json(await agregarApoyo(req.body));
    } catch (error) {
        responderError(res, error);
    }
});

apoyoReporteRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const apoyo = await actualizarApoyo(
            Number(req.params.id),
            req.body
        );

        if (!apoyo) {
            res.status(404).json({ mensaje: "Apoyo no encontrado." });
            return;
        }

        res.status(200).json(apoyo);
    } catch (error) {
        responderError(res, error);
    }
});

apoyoReporteRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const apoyo = await eliminarApoyo(Number(req.params.id));

        if (!apoyo) {
            res.status(404).json({ mensaje: "Apoyo no encontrado." });
            return;
        }

        res.status(200).json(apoyo);
    } catch (error) {
        responderError(res, error);
    }
});

export default apoyoReporteRouter;