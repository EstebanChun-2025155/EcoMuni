import { pool } from "../config/database";
import { Reporte } from "../models/reporte";
import { validarReporte } from "../utils/validaciones";

function validarId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
}

export function leerFiltros(query: any) {
    return {
        categoria: query.categoria ? String(query.categoria) : undefined,
        estado: query.estado ? String(query.estado) : undefined,
        buscar: query.buscar ? String(query.buscar) : undefined,
    };
}

export async function listarReportes(departamento: string, actor: any, filtros: any) {
    let sql = `
        select r.id_reporte as "idReporte", r.codigo, r.titulo, r.descripcion, 
               r.prioridad, r.fecha_reporte as "fechaReporte",
               c.categoria, e.nombre as estado
        from reporte r
        join categoria c on c.id_categoria = r.id_categoria
        join estado_reporte e on e.id_estado = r.id_estado
        join ubicacion u on u.id_ubicacion = r.id_ubicacion
        where u.departamento = $1
    `;
    const params: any[] = [departamento];

    if (filtros.categoria) {
        params.push(filtros.categoria);
        sql += ` and c.categoria = $${params.length}`;
    }

    if (filtros.estado) {
        params.push(filtros.estado);
        sql += ` and e.nombre = $${params.length}`;
    }

    sql += ` order by r.fecha_reporte desc`;

    const resultado = await pool.query(sql, params);
    return { reportes: resultado.rows };
}

export async function detalleReporte(departamento: string, id: number, actor: any) {
    if (!validarId(id)) throw new Error("ID de reporte inválido.");

    const resultado = await pool.query(
        `select r.id_reporte as "idReporte", r.codigo, r.titulo, r.descripcion, 
                r.prioridad, r.fecha_reporte as "fechaReporte",
                c.categoria, e.nombre as estado
         from reporte r
         join categoria c on c.id_categoria = r.id_categoria
         join estado_reporte e on e.id_estado = r.id_estado
         join ubicacion u on u.id_ubicacion = r.id_ubicacion
         where r.id_reporte = $1 and u.departamento = $2`,
        [id, departamento]
    );

    return resultado.rows[0] || null;
}

export async function agregarReporte(departamento: string, cuerpo: any, actor: any) {
    const { idCategoria, idUbicacion, idEstado, codigo, titulo, descripcion, prioridad } = cuerpo;

    const errores = validarReporte(
        actor.idUsuario,
        idCategoria,
        idUbicacion,
        idEstado,
        codigo,
        titulo,
        descripcion,
        prioridad,
        undefined,
        new Date(),
        new Date()
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    const resultado = await pool.query(
        `insert into reporte (id_usuario, id_categoria, id_ubicacion, id_estado, codigo, titulo, descripcion, prioridad, fecha_reporte, fecha_actualizacion)
         values ($1, $2, $3, $4, $5, $6, $7, $8, now(), now())
         returning id_reporte as "idReporte", codigo, titulo`,
        [actor.idUsuario, idCategoria, idUbicacion, idEstado, codigo.trim(), titulo.trim(), descripcion.trim(), prioridad.trim()]
    );

    return resultado.rows[0];
}

export async function comentar(departamento: string, idReporte: number, cuerpo: any, actor: any) {
    if (!validarId(idReporte)) throw new Error("ID de reporte inválido.");

    const resultado = await pool.query(
        `insert into comentario_reporte (id_reporte, id_usuario, contenido, fecha_comentario)
         values ($1, $2, $3, now())
         returning id_comentario as "idComentario", contenido, fecha_comentario as "fechaComentario"`,
        [idReporte, actor.idUsuario, cuerpo.comentario?.trim()]
    );

    return resultado.rows[0];
}

export async function apoyar(departamento: string, idReporte: number, actor: any, apoyando: boolean) {
    if (!validarId(idReporte)) throw new Error("ID de reporte inválido.");

    if (apoyando) {
        await pool.query(
            `insert into apoyo_reporte (id_reporte, id_usuario)
             values ($1, $2)
             on conflict (id_reporte, id_usuario) do nothing`,
            [idReporte, actor.idUsuario]
        );
        return { mensaje: "Apoyo registrado correctamente" };
    } else {
        await pool.query(
            `delete from apoyo_reporte where id_reporte = $1 and id_usuario = $2`,
            [idReporte, actor.idUsuario]
        );
        return { mensaje: "Apoyo retirado correctamente" };
    }
}

export async function seguir(departamento: string, idReporte: number, cuerpo: any, actor: any) {
    if (!validarId(idReporte)) throw new Error("ID de reporte inválido.");

    const resultado = await pool.query(
        `insert into seguimiento_reporte (id_reporte, id_usuario, detalle, fecha_seguimiento)
         values ($1, $2, $3, now())
         returning id_seguimiento as "idSeguimiento", detalle, fecha_seguimiento as "fechaSeguimiento"`,
        [idReporte, actor.idUsuario, cuerpo.detalle?.trim()]
    );

    return resultado.rows[0];
}