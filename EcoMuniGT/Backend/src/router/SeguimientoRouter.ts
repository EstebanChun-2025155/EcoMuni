import { Request, Response, Router } from "express";
import {
    actualizarSeguimiento,
    agregarSeguimiento,
    buscarSeguimiento,
    eliminarSeguimiento,
    listarSeguimientos
} from "../service/seguimientoService";
import { responderError } from "./respuestaError";

const seguimientoRouter = Router();

seguimientoRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await listarSeguimientos());
    } catch (error) {
        responderError(res, error);
    }
});

seguimientoRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const seguimiento = await buscarSeguimiento(Number(req.params.id));

        if (!seguimiento) {
            res.status(404).json({ mensaje: "Seguimiento no encontrado." });
            return;
        }

        res.status(200).json(seguimiento);
    } catch (error) {
        responderError(res, error);
    }
});

seguimientoRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).json(await agregarSeguimiento(req.body));
    } catch (error) {
        responderError(res, error);
    }
});

seguimientoRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const seguimiento = await actualizarSeguimiento(
            Number(req.params.id),
            req.body
        );

        if (!seguimiento) {
            res.status(404).json({ mensaje: "Seguimiento no encontrado." });
            return;
        }

        res.status(200).json(seguimiento);
    } catch (error) {
        responderError(res, error);
    }
});

seguimientoRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const seguimiento = await eliminarSeguimiento(Number(req.params.id));

        if (!seguimiento) {
            res.status(404).json({ mensaje: "Seguimiento no encontrado." });
            return;
        }

        res.status(200).json(seguimiento);
    } catch (error) {
        responderError(res, error);
    }
});

export default seguimientoRouter;