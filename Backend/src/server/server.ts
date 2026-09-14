import cors from "cors";
import express from "express";
import rolRouter from "../router/rolRouter";
import ubicacionRouter from "../router/ubicacionRouter";
import usuarioRouter from "../router/usuarioRouter";

const servidor = express();

servidor.use(cors());
servidor.use(express.json());
servidor.use("/api/roles", rolRouter);
servidor.use("/api/ubicaciones", ubicacionRouter);
servidor.use("/api/usuarios", usuarioRouter);

servidor.get("/api", (_req, res) => {
    res.status(200).json({ mensaje: "API EcoMuni disponible." });
});

export function iniciarServidor(): void {
    const puerto = Number(process.env.PORT || 3000);
    servidor.listen(puerto, () => console.log(`Servidor ejecutándose en el puerto ${puerto}.`));
}

export default servidor;