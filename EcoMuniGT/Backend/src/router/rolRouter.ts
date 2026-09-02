import { Request, Response, Router } from "express";
import { actualizarRol, agregarRol, buscarRol, eliminarRol, listarRoles } from "../service/rolService";
import { responderError } from "./respuestaError";

const rolRouter = Router();

rolRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await listarRoles());
    } catch (error) {
        responderError(res, error);
    }
});

rolRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const rol = await buscarRol(Number(req.params.id));

        if (!rol) {
            res.status(404).json({ mensaje: "Rol no encontrado." });
            return;
        }

        res.status(200).json(rol);
    } catch (error) {
        responderError(res, error);
    }
});

rolRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).json(await agregarRol(req.body));
    } catch (error) {
        responderError(res, error);
    }
});

rolRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const rol = await actualizarRol(Number(req.params.id), req.body);

        if (!rol) {
            res.status(404).json({ mensaje: "Rol no encontrado." });
            return;
        }

        res.status(200).json(rol);
    } catch (error) {
        responderError(res, error);
    }
});

rolRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const rol = await eliminarRol(Number(req.params.id));

        if (!rol) {
            res.status(404).json({ mensaje: "Rol no encontrado." });
            return;
        }

        res.status(200).json(rol);
    } catch (error) {
        responderError(res, error);
    }
});

export default rolRouter;