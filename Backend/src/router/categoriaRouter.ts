import { Request, Response, Router } from "express";
import {
    actualizarCategoria,
    agregarCategoria,
    buscarCategoria,
    eliminarCategoria,
    listarCategorias
} from "../service/categoriaService";
import { responderError } from "./RespuestaError";

const categoriaRouter = Router();

categoriaRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await listarCategorias());
    } catch (error) {
        responderError(res, error);
    }
});

categoriaRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const categoria = await buscarCategoria(Number(req.params.id));

        if (!categoria) {
            res.status(404).json({ mensaje: "Categoría no encontrada." });
            return;
        }

        res.status(200).json(categoria);
    } catch (error) {
        responderError(res, error);
    }
});

categoriaRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).json(await agregarCategoria(req.body));
    } catch (error) {
        responderError(res, error);
    }
});

categoriaRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const categoria = await actualizarCategoria(Number(req.params.id), req.body);

        if (!categoria) {
            res.status(404).json({ mensaje: "Categoría no encontrada." });
            return;
        }

        res.status(200).json(categoria);
    } catch (error) {
        responderError(res, error);
    }
});

categoriaRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const categoria = await eliminarCategoria(Number(req.params.id));

        if (!categoria) {
            res.status(404).json({ mensaje: "Categoría no encontrada." });
            return;
        }

        res.status(200).json(categoria);
    } catch (error) {
        responderError(res, error);
    }
});

export default categoriaRouter;