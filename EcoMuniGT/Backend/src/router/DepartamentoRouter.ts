import { Request, Response, Router } from "express";

import {
    obtenerDepartamento,
    obtenerDetalleReporte,
    crearReporte
} from "../service/DepartamentoService";

import { autenticar } from "../middleware/authMiddleware";

const router = Router();

router.post(
    "/:slug/reportes",
    autenticar,
    async (req: Request, res: Response) => {
        try {

            if (!req.usuario) {
                res.status(401).json({
                    mensaje: "Debes iniciar sesión para crear un reporte."
                });
                return;
            }

            const {
                titulo,
                descripcion,
                idCategoria,
                prioridad,
                municipio,
                zona,
                direccion,
                referencia
            } = req.body;

            if (
                typeof titulo !== "string" ||
                typeof descripcion !== "string" ||
                typeof municipio !== "string" ||
                typeof zona !== "string" ||
                typeof direccion !== "string" ||
                typeof referencia !== "string"
            ) {
                res.status(400).json({
                    mensaje: "Los datos del reporte no son válidos."
                });
                return;
            }

            const categoria = Number(idCategoria);

            if (!Number.isInteger(categoria) || categoria <= 0) {
                res.status(400).json({
                    mensaje: "La categoría no es válida."
                });
                return;
            }

            if (
                prioridad !== "baja" &&
                prioridad !== "media" &&
                prioridad !== "alta"
            ) {
                res.status(400).json({
                    mensaje: "La prioridad no es válida."
                });
                return;
            }

            if (!titulo.trim()) {
                res.status(400).json({
                    mensaje: "El título es obligatorio."
                });
                return;
            }

            if (!descripcion.trim()) {
                res.status(400).json({
                    mensaje: "La descripción es obligatoria."
                });
                return;
            }

            if (!municipio.trim()) {
                res.status(400).json({
                    mensaje: "El municipio es obligatorio."
                });
                return;
            }

            if (titulo.trim().length > 100) {
                res.status(400).json({
                    mensaje: "El título no puede superar los 100 caracteres."
                });
                return;
            }

            if (descripcion.trim().length > 500) {
                res.status(400).json({
                    mensaje: "La descripción no puede superar los 500 caracteres."
                });
                return;
            }

            const idReporte = await crearReporte(
                req.params.slug,
                req.usuario.idUsuario,
                {
                    titulo,
                    descripcion,
                    idCategoria: categoria,
                    prioridad,
                    municipio,
                    zona,
                    direccion,
                    referencia
                }
            );

            if (idReporte === null) {
                res.status(404).json({
                    mensaje: "Departamento no disponible."
                });
                return;
            }

            res.status(201).json({
                id: idReporte
            });

        } catch (error: any) {

            if (
                error instanceof Error &&
                (
                    error.message === "Los campos obligatorios deben completarse." ||
                    error.message === "La categoría no es válida." ||
                    error.message === "La prioridad no es válida." ||
                    error.message === "La categoría no existe o está inactiva." ||
                    error.message === "No existe el estado Pendiente."
                )
            ) {
                res.status(400).json({
                    mensaje: error.message
                });
                return;
            }

            console.error(
                "Error al crear reporte:",
                error
            );

            res.status(500).json({
                mensaje: "No fue posible crear el reporte."
            });
        }
    }
);

router.get(
    "/:slug/reportes/:id",
    async (req: Request, res: Response) => {
        try {
            const idReporte = Number(req.params.id);

            if (!Number.isInteger(idReporte) || idReporte <= 0) {
                res.status(400).json({
                    mensaje: "El ID del reporte no es válido."
                });
                return;
            }

            const detalle = await obtenerDetalleReporte(
                req.params.slug,
                idReporte
            );

            if (!detalle) {
                res.status(404).json({
                    mensaje: "Reporte no encontrado."
                });
                return;
            }

            res.status(200).json(detalle);
        } catch (error) {
            console.error(
                "Error al obtener detalle del reporte:",
                error
            );

            res.status(500).json({
                mensaje: "No fue posible obtener el reporte."
            });
        }
    }
);

router.get("/:slug", async (req: Request, res: Response) => {
    try {
        const pagina = Number(req.query.pagina ?? 1);

        const idEstado =
            req.query.idEstado !== undefined
                ? Number(req.query.idEstado)
                : undefined;

        const idCategoria =
            req.query.idCategoria !== undefined
                ? Number(req.query.idCategoria)
                : undefined;

        const prioridad =
            typeof req.query.prioridad === "string"
                ? req.query.prioridad
                : undefined;

        if (!Number.isInteger(pagina) || pagina < 1) {
            res.status(400).json({
                mensaje: "La página debe ser un número entero válido."
            });
            return;
        }

        if (
            idEstado !== undefined &&
            (!Number.isInteger(idEstado) || idEstado <= 0)
        ) {
            res.status(400).json({
                mensaje: "El ID del estado no es válido."
            });
            return;
        }

        if (
            idCategoria !== undefined &&
            (!Number.isInteger(idCategoria) || idCategoria <= 0)
        ) {
            res.status(400).json({
                mensaje: "El ID de la categoría no es válido."
            });
            return;
        }

        const departamento = await obtenerDepartamento(
            req.params.slug,
            pagina,
            idEstado,
            idCategoria,
            prioridad
        );

        if (!departamento) {
            res.status(404).json({
                mensaje: "Departamento no disponible."
            });
            return;
        }

        res.status(200).json(departamento);
    } catch (error) {
        console.error(
            "Error al obtener departamento:",
            error
        );

        res.status(500).json({
            mensaje: "No fue posible obtener el departamento."
        });
    }
});

export default router;