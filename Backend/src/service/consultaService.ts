import { pool } from "../config/database.js";
import { departamentos } from "../config/departamentos.js";
import { ApiError } from "../utils/apiError.js";

const nombres = [...departamentos.values()].map(nombre => nombre.toLowerCase());
export function slugDepartamento(nombre: string): string {
    return [...departamentos].find(([, valor]) => valor.toLowerCase() === nombre.trim().toLowerCase())?.[0] ?? "";
}
export async function departamentoDeReporte(id: number): Promise<string> {
    const r = await pool.query<{departamento: string}>(
        "SELECT u.departamento FROM reporte r JOIN ubicacion u ON u.id_ubicacion=r.id_ubicacion WHERE r.id_reporte=$1 AND lower(btrim(u.departamento))=ANY($2::text[])", [id, nombres]
    );
    if (!r.rows[0]) throw new ApiError(404, "Reporte no encontrado en los departamentos disponibles.");
    return r.rows[0].departamento;
}
async function paginar(columnas: string, desde: string, pagina: number) {
    const porPagina = 12;
    const [listado, cantidad] = await Promise.all([
        pool.query("SELECT " + columnas + desde + " ORDER BY 1 DESC LIMIT $2 OFFSET $3", [nombres, porPagina, (pagina - 1) * porPagina]),
        pool.query<{total: number}>("SELECT count(*)::integer AS total" + desde, [nombres])
    ]);
    return {items: listado.rows.map(row => ({...row, slug: row.departamento ? slugDepartamento(row.departamento) : undefined})), total: cantidad.rows[0].total, pagina, porPagina};
}
export function consultarUbicaciones(pagina: number) {
    return paginar('u.id_ubicacion AS "idUbicacion",u.departamento,u.municipio,u.zona,u.direccion,u.referencia',
        " FROM ubicacion u WHERE lower(btrim(u.departamento))=ANY($1::text[])", pagina);
}
export function consultarEvidencias(pagina: number) {
    return paginar(`e.id_evidencia AS "idEvidencia",e.id_reporte AS "idReporte",e.url_imagen AS "urlImagen",e.descripcion,r.titulo,u.departamento,to_char(e.fecha_subida,'DD/MM/YYYY') AS fecha`,
        " FROM evidencia e JOIN reporte r ON r.id_reporte=e.id_reporte JOIN ubicacion u ON u.id_ubicacion=r.id_ubicacion WHERE lower(btrim(u.departamento))=ANY($1::text[])", pagina);
}
export async function consultarCategorias(pagina: number) {
    const result = await pool.query(
        `SELECT c.id_categoria AS "idCategoria",c.categoria,c.descripcion,
        (SELECT count(*)::integer FROM reporte r JOIN ubicacion u ON u.id_ubicacion=r.id_ubicacion WHERE r.id_categoria=c.id_categoria AND lower(btrim(u.departamento))=ANY($1::text[])) AS total
        FROM categoria c WHERE c.estado='activa' ORDER BY c.id_categoria`, [nombres]
    );
    const porPagina = 12;
    return {items: result.rows.slice((pagina - 1) * porPagina, pagina * porPagina), total: result.rows.length, pagina, porPagina};
}
export function consultarReportes(pagina: number) {
    return paginar(`r.id_reporte AS "idReporte",r.titulo,r.descripcion,r.prioridad,r.codigo,e.nombre AS estado,c.categoria,u.departamento,
        concat_ws(', ',u.municipio,nullif(u.zona,''),nullif(u.direccion,'')) AS ubicacion,to_char(r.fecha_reporte,'DD/MM/YYYY') AS fecha`,
        " FROM reporte r JOIN ubicacion u ON u.id_ubicacion=r.id_ubicacion JOIN categoria c ON c.id_categoria=r.id_categoria JOIN estadoreporte e ON e.id_estado=r.id_estado WHERE lower(btrim(u.departamento))=ANY($1::text[])", pagina);
}
