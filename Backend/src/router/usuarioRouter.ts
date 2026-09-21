import { Router } from "express";
import { 
    listarUsuarios, 
    buscarUsuario, 
    agregarUsuario, 
    actualizarUsuario, 
    eliminarUsuario 
} from "../service/usuarioService.js";
import { exigirSesion, exigirAdmin } from "../middleware/autorizacion.js";

export const usuarioRouter = Router();

// Rutas protegidas para administración de usuarios
usuarioRouter.get("/", exigirSesion, exigirAdmin, async (req, res, next) => {
    try {
        const usuarios = await listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        next(error);
    }
});

usuarioRouter.get("/:id", exigirSesion, exigirAdmin, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const usuario = await buscarUsuario(id);
        if (!usuario) {
            res.status(404).json({ mensaje: "Usuario no encontrado." });
            return;
        }
        res.json(usuario);
    } catch (error) {
        next(error);
    }
});

usuarioRouter.post("/", exigirSesion, exigirAdmin, async (req, res, next) => {
    try {
        const nuevoUsuario = await agregarUsuario(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        next(error);
    }
});

usuarioRouter.put("/:id", exigirSesion, exigirAdmin, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const usuarioActualizado = await actualizarUsuario(id, req.body);
        if (!usuarioActualizado) {
            res.status(404).json({ mensaje: "Usuario no encontrado." });
            return;
        }
        res.json(usuarioActualizado);
    } catch (error) {
        next(error);
    }
});

usuarioRouter.delete("/:id", exigirSesion, exigirAdmin, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const usuarioEliminado = await eliminarUsuario(id);
        if (!usuarioEliminado) {
            res.status(404).json({ mensaje: "Usuario no encontrado." });
            return;
        }
        res.json(usuarioEliminado);
    } catch (error) {
        next(error);
    }
});