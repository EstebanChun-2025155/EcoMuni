import { Request, Response, Router } from "express";
import {
    actualizarComentario,
    agregarComentario,
    buscarComentario,
    eliminarComentario,
    listarComentarios
} from "../service/comentarioReporteService";
import { responderError } from "./respuestaError";

const comentarioReporteRouter = Router();

comentarioReporteRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await listarComentarios());
    } catch (error) {
        responderError(res, error);
    }
});

comentarioReporteRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const comentario = await buscarComentario(Number(req.params.id));

        if (!comentario) {
            res.status(404).json({ mensaje: "Comentario no encontrado." });
            return;
        }

        res.status(200).json(comentario);
    } catch (error) {
        responderError(res, error);
    }
});

comentarioReporteRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).json(await agregarComentario(req.body));
    } catch (error) {
        responderError(res, error);
    }
});

comentarioReporteRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const comentario = await actualizarComentario(
            Number(req.params.id),
            req.body
        );

        if (!comentario) {
            res.status(404).json({ mensaje: "Comentario no encontrado." });
            return;
        }

        res.status(200).json(comentario);
    } catch (error) {
        responderError(res, error);
    }
});

comentarioReporteRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const comentario = await eliminarComentario(Number(req.params.id));

        if (!comentario) {
            res.status(404).json({ mensaje: "Comentario no encontrado." });
            return;
        }

        res.status(200).json(comentario);
    } catch (error) {
        responderError(res, error);
    }
});

export default comentarioReporteRouter;