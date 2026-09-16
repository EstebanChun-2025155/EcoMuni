import cors from "cors";
import express from "express";
import rolRouter from "../router/rolRouter";
import ubicacionRouter from "../router/ubicacionRouter";
import usuarioRouter from "../router/usuarioRouter";
import authRouter from "../router/authRouter";
import { middlewareSesion } from "../config/sesion";

const servidor = express();
const origenFrontend = process.env.FRONTEND_ORIGIN || "http://localhost:4200";

servidor.use(cors({
    origin: origenFrontend,
    credentials: true
}));

servidor.use((req, res, next) => {
    const esLectura = ["GET", "HEAD", "OPTIONS"].includes(req.method);
    const origen = req.get("Origin");

    if (!esLectura && origen && origen !== origenFrontend) {
        res.status(403).json({ mensaje: "Origen no permitido." });
        return;
    }

    next();
});

servidor.use(express.json({ limit: "100kb" }));
servidor.use(middlewareSesion);

servidor.use("/api/auth", authRouter);
servidor.use("/api/roles", rolRouter);
servidor.use("/api/ubicaciones", ubicacionRouter);
servidor.use("/api/usuarios", usuarioRouter);

servidor.get("/api", (_req, res) => {
    res.status(200).json({ mensaje: "API EcoMuni disponible." });
});

export function iniciarServidor(): void {
    const puerto = Number(process.env.PORT || 3000);
    servidor.listen(puerto, "127.0.0.1", () => {
        console.log(`Servidor disponible en http://localhost:${puerto}`);
    });
}

export default servidor;