import { Router, raw } from "express";
import { nombreDepartamento } from "../config/departamentos";
import { exigirSesion, exigirGestion, puedeGestionar, type Actor } from "../middleware/autorizacion";
import { idParametro } from "../utils/apiError";
import { listarCategorias } from "../service/categoriaService";
import { listarEstados } from "../service/estadoReporteService";
import { listarPuntos, agregarPunto } from "../service/puntoReciclajeService";
import { listarReportes, leerFiltros, detalleReporte, agregarReporte, comentar, apoyar, seguir } from "../service/reporteService";
import { agregarEvidencia, describirEvidencia, maximoImagen } from "../service/evidenciaService";


const router = Router();
router.use(exigirSesion);
router.param("slug", (req,res,next,value) => {
    try { res.locals.departamento = nombreDepartamento(value); next(); } catch(error) { next(error); }
});

router.get("/:slug",async (req,res) => {
    const actor = res.locals.actor as Actor;
    const nombre = res.locals.departamento as string;
    const [listado,categorias,estados,puntos] = await Promise.all([
        listarReportes(nombre,actor,leerFiltros(req.query)),
        listarCategorias(),listarEstados(),listarPuntos(nombre)
    ]);
    res.json({...listado,categorias,estados,puntos,puedeGestionar:puedeGestionar(actor)});
});

router.get("/:slug/reportes/:id",async (req,res) => {
    res.json(await detalleReporte(res.locals.departamento,idParametro(req.params.id),res.locals.actor));
});
router.post("/:slug/reportes",async (req,res) => {
    res.status(201).json(await agregarReporte(res.locals.departamento,req.body,res.locals.actor));
});
router.post("/:slug/reportes/:id/comentarios",async (req,res) => {
    res.status(201).json(await comentar(res.locals.departamento,idParametro(req.params.id),req.body,res.locals.actor));
});
router.post("/:slug/reportes/:id/apoyo",async (req,res) => {
    res.json(await apoyar(res.locals.departamento,idParametro(req.params.id),res.locals.actor,true));
});
router.delete("/:slug/reportes/:id/apoyo",async (req,res) => {
    res.json(await apoyar(res.locals.departamento,idParametro(req.params.id),res.locals.actor,false));
});
router.post("/:slug/reportes/:id/seguimientos",exigirGestion,async (req,res) => {
    res.status(201).json(await seguir(res.locals.departamento,idParametro(req.params.id),req.body,res.locals.actor));
});
router.post("/:slug/puntos",exigirGestion,async (req,res) => {
    res.status(201).json(await agregarPunto(res.locals.departamento,req.body));
});
router.post("/:slug/reportes/:id/evidencias",raw({type:["image/png","image/jpeg","image/webp"],limit:maximoImagen}),async (req,res) => {
    res.status(201).json(await agregarEvidencia(res.locals.departamento,idParametro(req.params.id),req.body,req.get("Content-Type")?.split(";")[0],res.locals.actor,req.query["descripcion"]));
});

router.patch("/:slug/reportes/:id/evidencias/:idEvidencia",async (req,res) => {
    res.json(await describirEvidencia(res.locals.departamento,idParametro(req.params.id),idParametro(req.params.idEvidencia),req.body,res.locals.actor));
});
export default router;
