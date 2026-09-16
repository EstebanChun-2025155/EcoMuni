import cors from "cors";
import express from "express";
import usuarioRouter from "../router/reporteRouter"; 
import categoriaRouter from "../router/categoriaRouter";
import evidenciaRouter from "../router/evidenciaRouter";
import reporteRouter from "../router/reporteRouter";

const servidor = express();

servidor.use(cors());
servidor.use(express.json());

// Rutas de la API
servidor.use("/api/categorias", categoriaRouter);
servidor.use("/api/evidencias", evidenciaRouter);
servidor.use("/api/reportes", reporteRouter);
servidor.use("/api/usuarios", usuarioRouter);

servidor.get("/api", (_req, res) => {
    res.status(200).json({ mensaje: "API EcoMuni disponible." });
});

export function iniciarServidor(): void {
    const puerto = Number(process.env.PORT || 3000);
    servidor.listen(puerto, () => console.log(`Servidor ejecutándose en el puerto ${puerto}.`));
}

export default servidor;