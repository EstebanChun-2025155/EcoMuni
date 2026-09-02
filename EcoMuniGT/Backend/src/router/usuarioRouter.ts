import { Request, Response, Router } from "express";
import { actualizarUsuario, agregarUsuario, buscarUsuario, eliminarUsuario, listarUsuarios } from "../service/usuarioService";
import { responderError } from "./respuestaError";

const usuarioRouter = Router();

usuarioRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await listarUsuarios());
    } catch (error) {
        responderError(res, error);
    }
});

usuarioRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const usuario = await buscarUsuario(Number(req.params.id));

        if (!usuario) {
            res.status(404).json({ mensaje: "Usuario no encontrado." });
            return;
        }

        res.status(200).json(usuario);
    } catch (error) {
        responderError(res, error);
    }
});

usuarioRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).json(await agregarUsuario(req.body));
    } catch (error) {
        responderError(res, error);
    }
});

usuarioRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const usuario = await actualizarUsuario(Number(req.params.id), req.body);

        if (!usuario) {
            res.status(404).json({ mensaje: "Usuario no encontrado." });
            return;
        }

        res.status(200).json(usuario);
    } catch (error) {
        responderError(res, error);
    }
});

usuarioRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const usuario = await eliminarUsuario(Number(req.params.id));

        if (!usuario) {
            res.status(404).json({ mensaje: "Usuario no encontrado." });
            return;
        }

        res.status(200).json(usuario);
    } catch (error) {
        responderError(res, error);
    }
});

export default usuarioRouter;