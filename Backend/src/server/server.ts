import cors from "cors";
import { pool } from "../config/database.js";
import express, { type ErrorRequestHandler } from "express";
import rolRouter from "../router/rolRouter.js";
import ubicacionRouter from "../router/ubicacionRouter.js";
import usuarioRouter from "../router/usuarioRouter.js";
import authRouter from "../router/authrouter.js";
import departamentoRouter from "../router/departamentoRouter.js";
import { middlewareSesion } from "../config/sesion.js";
import { exigirSesion, exigirGestion, exigirAdmin } from "../middleware/autorizacion.js";
import { carpetaEvidencias } from "../service/evidenciaService.js";
import { ApiError } from "../utils/apiError.js";
import { responderError } from "../router/RespuestaError.js";

import categoriaRouter from "../router/categoriaRouter.js";
import reporteRouter from "../router/reporteRouter.js";
import evidenciaRouter from "../router/evidenciaRouter.js";
import consultaRouter from "../router/consultaRouter.js";
const servidor = express();
const origenFrontend = process.env.FRONTEND_ORIGIN || "http://localhost:4200";

servidor.disable("x-powered-by");
servidor.use(cors({ origin: origenFrontend, credentials: true }));
servidor.use((req,res,next) => {
    const esLectura = ["GET","HEAD","OPTIONS"].includes(req.method);
    const origen = req.get("Origin");
    if (!esLectura && origen && origen !== origenFrontend) {
        res.status(403).json({mensaje:"Origen no permitido."});
        return;
    }
    res.setHeader("X-Content-Type-Options","nosniff");
    next();
});
servidor.use(express.json({limit:"100kb"}));
servidor.use(middlewareSesion);

servidor.use("/api/auth",authRouter);
servidor.use("/api/departamentos",departamentoRouter);
servidor.use("/api/categorias",categoriaRouter);
servidor.use("/api/reportes",reporteRouter);
servidor.use("/api/evidencias",evidenciaRouter);
servidor.use("/api/consulta",exigirSesion,consultaRouter);
servidor.use("/api/archivos",exigirSesion,async(req,res,next)=>{
    const existe=await pool.query("SELECT id_evidencia FROM evidencia WHERE url_imagen=$1 LIMIT 1",["/api/archivos"+req.path]);
    if(!existe.rows.length){res.status(404).json({mensaje:"Archivo no encontrado."});return;}
    next();
},express.static(carpetaEvidencias,{
    index:false,dotfiles:"deny",fallthrough:false,
    setHeaders: res => res.setHeader("Cache-Control","private, max-age=3600")
}));
servidor.use("/api/roles",exigirSesion,exigirAdmin,rolRouter);
servidor.use("/api/ubicaciones",exigirSesion,exigirGestion,ubicacionRouter);
servidor.use("/api/usuarios",exigirSesion,exigirAdmin,usuarioRouter);
servidor.get("/api",(_req,res) => {
    res.json({mensaje:"API EcoMuni disponible."});
});
servidor.use("/api",(_req,res) => {
    res.status(404).json({mensaje:"Ruta no encontrada."});
});

const errores: ErrorRequestHandler = (error,_req,res,_next) => {
    if (error instanceof ApiError) {
        res.status(error.status).json({mensaje:error.message});
    } else if (error?.type === "entity.too.large") {
        res.status(413).json({mensaje:"El archivo o los datos exceden el tamaño permitido."});
    } else if (error?.type === "entity.parse.failed") {
        res.status(400).json({mensaje:"El JSON enviado no es válido."});
    } else if (error?.status === 404) {
        res.status(404).json({mensaje:"Archivo no encontrado."});
    } else {
        responderError(res,error);
    }
};
servidor.use(errores);

export function iniciarServidor(): void {
    const puerto = Number(process.env.PORT || 3000);
    servidor.listen(puerto,"127.0.0.1",() => {
        console.log("Servidor disponible en http://localhost:"+puerto);
    });
}
export default servidor;
