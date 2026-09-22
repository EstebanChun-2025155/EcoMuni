import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { autenticarUsuario, registrarCiudadano } from "../service/authService";
import { responderError } from "./respuestaError";
import { buscarUsuario } from "../service/usuarioService";
import { nombreCookie, opcionesCookie } from "../config/sesion";

const authRouter = Router();

authRouter.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

const limitarLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: { mensaje: "Demasiados intentos. Espera 15 minutos." }
});

authRouter.post("/login", limitarLogin, async (req, res) => {
    try {
        if (!req.is("application/json")) {
            res.status(415).json({ mensaje: "Envía las credenciales en JSON." });
            return;
        }

        const { correo, contrasena } = req.body ?? {};

        if (
            typeof correo !== "string" ||
            typeof contrasena !== "string" ||
            correo.trim().length > 120 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) ||
            contrasena.length === 0 ||
            Buffer.byteLength(contrasena, "utf8") > 72
        ) {
            res.status(400).json({ mensaje: "Datos de acceso inválidos." });
            return;
        }

        const usuario = await autenticarUsuario(correo, contrasena);

        if (!usuario) {
            res.status(401).json({
                mensaje: "Credenciales incorrectas o cuenta no disponible."
            });
            return;
        }

        await new Promise<void>((resolve, reject) => {
            req.session.regenerate(error => {
                if (error) reject(error);
                else resolve();
            });
        });

        req.session.idUsuario = usuario.idUsuario;

        await new Promise<void>((resolve, reject) => {
            req.session.save(error => {
                if (error) reject(error);
                else resolve();
            });
        });

        res.status(200).json({ usuario });
    } catch (error) {
        console.error("Error de login:", error);
        res.status(500).json({ mensaje: "No fue posible iniciar sesión." });
    }
});

authRouter.get("/me", async (req, res) => {
    try {
        const idUsuario = req.session.idUsuario;

        if (!idUsuario) {
            res.status(401).json({ mensaje: "No hay una sesión activa." });
            return;
        }

        const usuario = await buscarUsuario(idUsuario);

        if (!usuario || usuario.estado !== "activo") {
            await new Promise<void>((resolve, reject) => {
                req.session.destroy(error => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            res.clearCookie(nombreCookie, opcionesCookie);
            res.status(401).json({ mensaje: "La sesión ya no es válida." });
            return;
        }

        res.status(200).json({
            usuario: {
                idUsuario: usuario.idUsuario,
                idRol: usuario.idRol,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                correo: usuario.correo,
                estado: usuario.estado
            }
        });
    } catch (error) {
        console.error("Error de sesión:", error);
        res.status(500).json({ mensaje: "No fue posible comprobar la sesión." });
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        await new Promise<void>((resolve, reject) => {
            req.session.destroy(error => {
                if (error) reject(error);
                else resolve();
            });
        });

        res.clearCookie(nombreCookie, opcionesCookie);
        res.status(204).send();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        res.status(500).json({ mensaje: "No fue posible cerrar la sesión." });
    }
});

const limitarRegistro = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { mensaje: "Demasiados intentos de registro. Inténtalo más tarde." }
});

authRouter.post("/register", limitarRegistro, async (req, res) => {
    try {
        if (!req.is("application/json")) {
            res.status(415).json({ mensaje: "Envía los datos en formato JSON." });
            return;
        }

        const {
            nombres, apellidos, correo,
            contrasena, confirmarContrasena, telefono
        } = req.body ?? {};

        if (
            typeof nombres !== "string" ||
            typeof apellidos !== "string" ||
            typeof correo !== "string" ||
            typeof contrasena !== "string" ||
            typeof confirmarContrasena !== "string" ||
            (telefono != null && typeof telefono !== "string")
        ) {
            res.status(400).json({ mensaje: "Los datos de registro son inválidos." });
            return;
        }

        if (contrasena !== confirmarContrasena) {
            res.status(400).json({ mensaje: "Las contraseñas no coinciden." });
            return;
        }

        if (Buffer.byteLength(contrasena, "utf8") > 72) {
            res.status(400).json({ mensaje: "La contraseña no puede superar 72 bytes." });
            return;
        }

        await registrarCiudadano({
            nombres,
            apellidos,
            correo,
            contrasena,
            telefono: telefono?.trim() || null
        });

        res.status(201).json({
            mensaje: "Cuenta creada correctamente. Ya puedes iniciar sesión."
        });
    } catch (error) {
        responderError(res, error);
    }
});

export default authRouter;