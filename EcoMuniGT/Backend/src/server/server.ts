import cors from "cors";
import express from "express";

import rolRouter from "../router/rolRouter";
import seguimientoRouter from "../router/SeguimientoRouter";
import apoyoReporteRouter from "../router/ApoyoReporteRouter";
import comentarioReporteRouter from "../router/ComentarioReporteRouter";

const servidor = express();

servidor.use(cors());
servidor.use(express.json());

servidor.use("/api/roles", rolRouter);
servidor.use("/api/seguimientos", seguimientoRouter);
servidor.use("/api/apoyos", apoyoReporteRouter);
servidor.use("/api/comentarios", comentarioReporteRouter);

servidor.get("/api", (_req, res) => {
    res.status(200).json({
        mensaje: "API EcoMuni disponible."
    });
});

export function iniciarServidor(): void {
    const puerto = Number(process.env.PORT || 3000);

    servidor.listen(puerto, () =>
        console.log(
            `Servidor ejecutándose en el puerto ${puerto}.`
        )
    );
}

export default servidor;