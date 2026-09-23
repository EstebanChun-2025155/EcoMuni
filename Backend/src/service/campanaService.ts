import { pool } from '../config/database';
import { transaccion } from '../config/transaccion';
import { puedeGestionar, type Actor } from '../middleware/autorizacion';
import { estadosCampana, type Campana, type EstadoCampana } from '../models/campana';
import { ApiError, objeto, texto, entero, idParametro, datosUbicacion } from '../utils/apiError';
import { agregarUbicacion } from './ubicacionService';

function validarLugar(entrada: unknown) {
  const data = objeto(entrada);
  return datosUbicacion(data, texto(data, 'departamento', 60));
}

function fecha(data: Record<string, unknown>, key: string): string {
  const valor = texto(data, key, 10);
  const parseada = new Date(valor + 'T00:00:00Z');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(valor) ||
    valor.slice(0, 4) === '0000' ||
    !Number.isFinite(parseada.getTime()) ||
    parseada.toISOString().slice(0, 10) !== valor
  ) {
    throw new ApiError(400, key + ': fecha inválida.');
  }
  return valor;
}

export function validarCampana(entrada: unknown) {
  const data = objeto(entrada);
  const fechaInicio = fecha(data, 'fechaInicio');
  const fechaFin = fecha(data, 'fechaFin');
  if (fechaFin < fechaInicio)
    throw new ApiError(400, 'La fecha final no puede ser anterior a la inicial.');
  const estado = texto(data, 'estado', 20);
  if (!estadosCampana.includes(estado as EstadoCampana))
    throw new ApiError(400, 'Estado de campaña inválido.');
  const imagenUrl = texto(data, 'imagenUrl', 300, false);
  if (imagenUrl) {
    try {
      const url = new URL(imagenUrl);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password)
        throw new Error();
    } catch {
      throw new ApiError(400, 'La imagen debe ser una URL HTTP o HTTPS válida.');
    }
  }
  return {
    titulo: texto(data, 'titulo', 100),
    descripcion: texto(data, 'descripcion', 500),
    organizador: texto(data, 'organizador', 100),
    ubicacion: data['ubicacion'] == null ? null : validarLugar(data['ubicacion']),
    fechaInicio,
    fechaFin,
    estado: estado as EstadoCampana,
    imagenUrl: imagenUrl || null,
  };
}

export function leerFiltrosCampana(query: Record<string, unknown>) {
  const pagina = query['pagina'] == null ? 1 : idParametro(query['pagina']);
  const busqueda = texto(query, 'busqueda', 100, false);
  const estado = texto(query, 'estado', 20, false);
  if (estado && !estadosCampana.includes(estado as EstadoCampana))
    throw new ApiError(400, 'Estado de campaña inválido.');
  return { pagina, busqueda, estado };
}

export async function listarCampanas(actor: Actor, filtros: ReturnType<typeof leerFiltrosCampana>) {
  const porPagina = 12;
  const condicion = ` FROM campana c LEFT JOIN ubicacion u ON u.id_ubicacion=c.id_ubicacion
        WHERE ($1::boolean OR c.estado IN ('publicada', 'finalizada'))
          AND ($2::text='' OR c.estado::text=$2)
          AND ($3::text='' OR concat_ws(' ',c.titulo,c.descripcion,c.organizador,u.departamento,u.municipio) ILIKE '%' || $3 || '%')`;
  const params = [puedeGestionar(actor), filtros.estado, filtros.busqueda];
  const [listado, cantidad] = await Promise.all([
    pool.query<Campana>(
      `SELECT c.id_campana AS "idCampana", c.id_usuario AS "idUsuario", c.id_ubicacion AS "idUbicacion",
                    c.titulo, c.descripcion, c.organizador, c.estado, c.imagen_url AS "imagenUrl",
                    to_char(c.fecha_inicio, 'YYYY-MM-DD') AS "fechaInicio", to_char(c.fecha_fin, 'YYYY-MM-DD') AS "fechaFin",
                    CASE WHEN u.id_ubicacion IS NULL THEN NULL ELSE json_build_object(
                        'departamento',u.departamento,'municipio',u.municipio,'zona',u.zona,
                        'direccion',u.direccion,'referencia',u.referencia) END AS ubicacion` +
        condicion +
        ' ORDER BY c.fecha_inicio DESC,c.id_campana DESC LIMIT $4 OFFSET $5',
      [...params, porPagina, (filtros.pagina - 1) * porPagina],
    ),
    pool.query<{ total: number }>('SELECT count(*)::integer AS total' + condicion, params),
  ]);
  return {
    campanas: listado.rows,
    total: cantidad.rows[0].total,
    pagina: filtros.pagina,
    porPagina,
    puedeGestionar: puedeGestionar(actor),
  };
}

export async function guardarCampana(entrada: unknown, actor: Actor, id?: number) {
  if (!puedeGestionar(actor))
    throw new ApiError(403, 'Solo administradores y supervisores pueden gestionar campañas.');
  const datos = validarCampana(entrada);
  return transaccion(async (db) => {
    let idUbicacionAnterior: number | null = null;
    if (id !== undefined) {
      const actual = await db.query<{ idUbicacion: number | null }>(
        'SELECT id_ubicacion AS "idUbicacion" FROM campana WHERE id_campana=$1 FOR UPDATE',
        [entero(id)],
      );
      if (!actual.rows[0]) throw new ApiError(404, 'La campaña no existe.');
      idUbicacionAnterior = actual.rows[0].idUbicacion;
    }
    let idUbicacion: number | null = null;
    if (datos.ubicacion) {
      const lugar = datos.ubicacion;

      const existente =
        idUbicacionAnterior === null
          ? null
          : await db.query(
              'SELECT id_ubicacion FROM ubicacion WHERE id_ubicacion=$1 AND departamento=$2 AND municipio=$3 AND zona IS NOT DISTINCT FROM $4 AND direccion IS NOT DISTINCT FROM $5 AND referencia IS NOT DISTINCT FROM $6 FOR SHARE',
              [
                idUbicacionAnterior,
                lugar.departamento,
                lugar.municipio,
                lugar.zona || null,
                lugar.direccion || null,
                lugar.referencia || null,
              ],
            );
      idUbicacion = existente?.rows.length
        ? idUbicacionAnterior
        : (await agregarUbicacion(lugar, db)).idUbicacion!;
    }
    const valores = [
      idUbicacion,
      datos.titulo,
      datos.descripcion,
      datos.organizador,
      datos.fechaInicio,
      datos.fechaFin,
      datos.imagenUrl,
      datos.estado,
    ];
    const result =
      id === undefined
        ? await db.query<{ id: number }>(
            'INSERT INTO campana(id_ubicacion,titulo,descripcion,organizador,fecha_inicio,fecha_fin,imagen_url,estado,id_usuario) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id_campana AS id',
            [...valores, actor.idUsuario],
          )
        : await db.query<{ id: number }>(
            'UPDATE campana SET id_ubicacion=$1,titulo=$2,descripcion=$3,organizador=$4,fecha_inicio=$5,fecha_fin=$6,imagen_url=$7,estado=$8 WHERE id_campana=$9 RETURNING id_campana AS id',
            [...valores, id],
          );
    return result.rows[0];
  });
}
