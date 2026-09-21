import { Request, Response, Router } from "express";
import {
    iniciarSesion,
    obtenerUsuarioSesion,
    cerrarSesion,
    registrarUsuario
} from "../service/AuthService";
import { autenticar } from "../middleware/authMiddleware";
import { autorizar } from "../middleware/autorizacionMiddleware";

const router = Router();

function obtenerToken(req: Request): string | null {
    const cookies = req.headers.cookie;

    if (!cookies) {
        return null;
    }

    const cookie = cookies
        .split(";")
        .map(valor => valor.trim())
        .find(valor => valor.startsWith("ecomuni_token="));

    if (!cookie) {
        return null;
    }

    return decodeURIComponent(
        cookie.substring("ecomuni_token=".length)
    );
}

function establecerCookie(res: Response, token: string): void {
    res.setHeader(
        "Set-Cookie",
        `ecomuni_token=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax`
    );
}

function eliminarCookie(res: Response): void {
    res.setHeader(
        "Set-Cookie",
        "ecomuni_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
    );
}

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { correo, contrasena } = req.body;

        if (
            typeof correo !== "string" ||
            typeof contrasena !== "string" ||
            !correo.trim() ||
            !contrasena
        ) {
            res.status(400).json({
                mensaje: "El correo y la contraseña son obligatorios."
            });
            return;
        }

        const sesion = await iniciarSesion(
            correo,
            contrasena
        );

        if (!sesion) {
            res.status(401).json({
                mensaje: "El correo o la contraseña son incorrectos."
            });
            return;
        }

        establecerCookie(res, sesion.token);

        res.status(200).json({
            usuario: sesion.usuario
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        res.status(500).json({
            mensaje: "No fue posible iniciar sesión."
        });
    }
});

router.get("/me", async (req: Request, res: Response) => {
    try {
        const token = obtenerToken(req);

        if (!token) {
            res.status(401).json({
                mensaje: "No hay una sesión activa."
            });
            return;
        }

        const usuario = await obtenerUsuarioSesion(token);

        if (!usuario) {
            eliminarCookie(res);

            res.status(401).json({
                mensaje: "La sesión no es válida."
            });
            return;
        }

        res.status(200).json({
            usuario
        });
    } catch (error) {
        console.error("Error al obtener sesión:", error);

        res.status(500).json({
            mensaje: "No fue posible obtener la sesión."
        });
    }
});

router.post("/logout", (req: Request, res: Response) => {
    const token = obtenerToken(req);

    if (token) {
        cerrarSesion(token);
    }

    eliminarCookie(res);

    res.status(200).json({
        mensaje: "Sesión cerrada correctamente."
    });
});

router.post("/register", async (req: Request, res: Response) => {
    try {
        const {
            nombres,
            apellidos,
            correo,
            contrasena,
            confirmarContrasena,
            telefono
        } = req.body;

        if (
            typeof nombres !== "string" ||
            typeof apellidos !== "string" ||
            typeof correo !== "string" ||
            typeof contrasena !== "string"
        ) {
            res.status(400).json({
                mensaje: "Los datos obligatorios no son válidos."
            });
            return;
        }

        if (
            !nombres.trim() ||
            !apellidos.trim() ||
            !correo.trim() ||
            !contrasena
        ) {
            res.status(400).json({
                mensaje: "Todos los campos obligatorios deben completarse."
            });
            return;
        }

        if (contrasena !== confirmarContrasena) {
            res.status(400).json({
                mensaje: "Las contraseñas no coinciden."
            });
            return;
        }

        if (contrasena.length < 8) {
            res.status(400).json({
                mensaje: "La contraseña debe tener al menos 8 caracteres."
            });
            return;
        }

        if (!/[A-Z]/.test(contrasena)) {
            res.status(400).json({
                mensaje: "La contraseña debe contener al menos una letra mayúscula."
            });
            return;
        }

        if (!/[a-z]/.test(contrasena)) {
            res.status(400).json({
                mensaje: "La contraseña debe contener al menos una letra minúscula."
            });
            return;
        }

        if (!/[0-9]/.test(contrasena)) {
            res.status(400).json({
                mensaje: "La contraseña debe contener al menos un número."
            });
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(contrasena)) {
            res.status(400).json({
                mensaje: "La contraseña debe contener al menos un carácter especial."
            });
            return;
        }

        const idUsuario = await registrarUsuario({
            nombres,
            apellidos,
            correo,
            contrasena,
            telefono
        });

        res.status(201).json({
            mensaje: "Usuario registrado correctamente.",
            idUsuario
        });
    } catch (error: any) {
        if (error?.code === "23505") {
            res.status(409).json({
                mensaje: "El correo electrónico ya está registrado."
            });
            return;
        }

        console.error("Error al registrar usuario:", error);

        res.status(500).json({
            mensaje: "No fue posible registrar el usuario."
        });
    }
});

router.get(
    "/prueba",
    autenticar,
    (req: Request, res: Response) => {
        res.status(200).json({
            mensaje: "Autenticación correcta.",
            idUsuario: req.usuario?.idUsuario,
            idRol: req.usuario?.idRol
        });
    }
);

router.get(
    "/prueba-gestor",
    autenticar,
    autorizar("Gestor", "Administrador"),
    (req: Request, res: Response) => {
        res.status(200).json({
            mensaje: "Autorización correcta.",
            idUsuario: req.usuario?.idUsuario,
            idRol: req.usuario?.idRol
        });
    }
);

export default router;