import { Request, Response, Router } from "express";
import {
    actualizarReporte,
    agregarReporte,
    buscarReporte,
    eliminarReporte,
    listarReportes
} from "../service/reporteService";
import { responderError } from "./RespuestaError";

const reporteRouter = Router();

reporteRouter.get("/", async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await listarReportes());
    } catch (error) {
        responderError(res, error);
    }
});

reporteRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const reporte = await buscarReporte(Number(req.params.id));

        if (!reporte) {
            res.status(404).json({ mensaje: "Reporte no encontrado." });
            return;
        }

        res.status(200).json(reporte);
    } catch (error) {
        responderError(res, error);
    }
});

reporteRouter.post("/", async (req: Request, res: Response) => {
    try {
        res.status(201).json(await agregarReporte(req.body));
    } catch (error) {
        responderError(res, error);
    }
});

reporteRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const reporte = await actualizarReporte(Number(req.params.id), req.body);

        if (!reporte) {
            res.status(404).json({ mensaje: "Reporte no encontrado." });
            return;
        }

        res.status(200).json(reporte);
    } catch (error) {
        responderError(res, error);
    }
});

reporteRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const reporte = await eliminarReporte(Number(req.params.id));

        if (!reporte) {
            res.status(404).json({ mensaje: "Reporte no encontrado." });
            return;
        }

        res.status(200).json(reporte);
    } catch (error) {
        responderError(res, error);
    }
});

export default reporteRouter;