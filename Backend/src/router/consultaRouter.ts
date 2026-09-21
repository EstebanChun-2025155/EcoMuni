import { Router } from "express";
import { idParametro } from "../utils/apiError.js";
import { consultarReportes, consultarCategorias, consultarEvidencias, consultarUbicaciones } from "../service/consultaService.js";
const router = Router();
router.get('/reportes', async(req,res) => {res.json(await consultarReportes(idParametro(req.query.pagina ?? '1')));});
router.get('/categorias', async(req,res) => {res.json(await consultarCategorias(idParametro(req.query.pagina ?? '1')));});
router.get('/evidencias', async(req,res) => {res.json(await consultarEvidencias(idParametro(req.query.pagina ?? '1')));});
router.get('/ubicaciones', async(req,res) => {res.json(await consultarUbicaciones(idParametro(req.query.pagina ?? '1')));});
export default router;
