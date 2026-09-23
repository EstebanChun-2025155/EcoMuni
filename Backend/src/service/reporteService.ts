import { randomBytes } from 'node:crypto';
import { pool } from '../config/database';
import { transaccion, type Conexion } from '../config/transaccion';
import type { Actor } from '../middleware/autorizacion';
import { puedeGestionar } from '../middleware/autorizacion';
import type { Reporte, PrioridadReporte } from '../models/reporte';
import { ApiError, objeto, texto, entero, datosUbicacion } from '../utils/apiError';
import { agregarUbicacion } from './ubicacionService';
import { agregarSeguimiento, listarSeguimientos } from './SeguimientoService';
import { agregarComentario, listarComentarios } from './ComentarioReporteService';
import { cambiarApoyo } from './ApoyoReporteService';
import { listarEvidencias } from './evidenciaService';

const columnas = [
  'r.id_reporte AS "idReporte", r.id_usuario AS "idUsuario", r.id_categoria AS "idCategoria", r.id_ubicacion AS "idUbicacion", r.id_estado AS "idEstado"',
  'r.codigo, r.titulo, r.descripcion, r.prioridad, r.motivo_rechazo AS "motivoRechazo"',
  "e.nombre AS estado, c.categoria::text AS categoria, to_char(r.fecha_reporte,'DD/MM/YYYY') AS fecha",
  "concat_ws(', ', u.municipio, nullif(u.zona,''), nullif(u.direccion,'')) AS ubicacion",
  '(SELECT count(*)::integer FROM apoyoreporte a WHERE a.id_reporte = r.id_reporte) AS apoyos',
  'EXISTS (SELECT 1 FROM apoyoreporte a WHERE a.id_reporte = r.id_reporte AND a.id_usuario = $2) AS apoyado',
  '(SELECT count(*)::integer FROM comentarioreporte co WHERE co.id_reporte = r.id_reporte AND co.estado = \'visible\') AS "totalComentarios"',
  '(SELECT ev.url_imagen FROM evidencia ev WHERE ev.id_reporte = r.id_reporte ORDER BY ev.id_evidencia LIMIT 1) AS miniatura',
].join(', ');

const joins =
  ' FROM reporte r JOIN ubicacion u ON u.id_ubicacion=r.id_ubicacion JOIN categoria c ON c.id_categoria=r.id_categoria JOIN estadoreporte e ON e.id_estado=r.id_estado ';

export interface FiltrosReporte {
  pagina: number;
  idEstado: number | null;
  idCategoria: number | null;
  prioridad: PrioridadReporte | null;
}

export function leerFiltros(query: Record<string, unknown>): FiltrosReporte {
  function numero(key: string): number | null {
    const value = query[key];
    if (value === undefined || value === '') return null;
    if (typeof value !== 'string' || !/^[1-9][0-9]*$/.test(value))
      throw new ApiError(400, 'Filtro ' + key + ' inválido.');
    return entero(Number(value), key);
  }
  const prioridad = query['prioridad'];
  if (
    prioridad !== undefined &&
    prioridad !== '' &&
    !['baja', 'media', 'alta'].includes(String(prioridad))
  ) {
    throw new ApiError(400, 'Prioridad inválida.');
  }
  return {
    pagina: numero('pagina') ?? 1,
    idEstado: numero('idEstado'),
    idCategoria: numero('idCategoria'),
    prioridad: prioridad ? (prioridad as PrioridadReporte) : null,
  };
}

export async function listarReportes(departamento: string, actor: Actor, filtros: FiltrosReporte) {
  const condicion =
    ' WHERE lower(btrim(u.departamento))=lower($1) AND ($3::integer IS NULL OR r.id_estado=$3) AND ($4::integer IS NULL OR r.id_categoria=$4) AND ($5::text IS NULL OR r.prioridad::text=$5)';
  const params = [
    departamento,
    actor.idUsuario,
    filtros.idEstado,
    filtros.idCategoria,
    filtros.prioridad,
  ];
  const porPagina = 12;
  const [listado, cantidad] = await Promise.all([
    pool.query<Reporte>(
      'SELECT ' + columnas + joins + condicion + ' ORDER BY r.id_reporte DESC LIMIT $6 OFFSET $7',
      [...params, porPagina, (filtros.pagina - 1) * porPagina],
    ),
    pool.query<{ total: number }>(
      'SELECT count(*)::integer AS total' + joins + condicion + ' AND $2::integer > 0',
      params,
    ),
  ]);
  return {
    reportes: listado.rows,
    total: cantidad.rows[0].total,
    pagina: filtros.pagina,
    porPagina,
  };
}

export async function comprobarReporte(
  db: Conexion,
  departamento: string,
  idReporte: number,
  bloquear = false,
) {
  const result = await db.query<{ idUsuario: number; idEstado: number }>(
    'SELECT r.id_usuario AS "idUsuario", r.id_estado AS "idEstado" FROM reporte r JOIN ubicacion u ON u.id_ubicacion=r.id_ubicacion WHERE r.id_reporte=$1 AND lower(btrim(u.departamento))=lower($2)' +
      (bloquear ? ' FOR UPDATE OF r' : ''),
    [idReporte, departamento],
  );
  if (!result.rows[0]) throw new ApiError(404, 'El reporte no existe en este departamento.');
  return result.rows[0];
}

export async function detalleReporte(departamento: string, idReporte: number, actor: Actor) {
  const result = await pool.query<Reporte>(
    'SELECT ' +
      columnas +
      joins +
      ' WHERE lower(btrim(u.departamento))=lower($1) AND r.id_reporte=$3',
    [departamento, actor.idUsuario, idReporte],
  );
  const reporte = result.rows[0];
  if (!reporte) throw new ApiError(404, 'El reporte no existe en este departamento.');
  const [comentarios, seguimientos, evidencias] = await Promise.all([
    listarComentarios(idReporte),
    listarSeguimientos(idReporte),
    listarEvidencias(idReporte),
  ]);
  return {
    ...reporte,
    comentarios,
    seguimientos,
    evidencias,
    puedeAdjuntar: reporte.idUsuario === actor.idUsuario || puedeGestionar(actor),
  };
}

export async function agregarReporte(departamento: string, entrada: unknown, actor: Actor) {
  const data = objeto(entrada);
  const lugar = datosUbicacion(data, departamento);
  const titulo = texto(data, 'titulo', 100);
  const descripcion = texto(data, 'descripcion', 500);
  const idCategoria = entero(data['idCategoria']);
  const prioridad = texto(data, 'prioridad', 10);
  if (!['baja', 'media', 'alta'].includes(prioridad))
    throw new ApiError(400, 'Prioridad inválida.');
  return transaccion(async (db) => {
    const categoria = await db.query(
      "SELECT id_categoria FROM categoria WHERE id_categoria=$1 AND estado='activa' FOR SHARE",
      [idCategoria],
    );
    if (!categoria.rows[0]) throw new ApiError(400, 'La categoría no está activa.');
    const estado = await db.query<{ id: number }>(
      "SELECT id_estado AS id FROM estadoreporte WHERE lower(btrim(nombre))='pendiente' ORDER BY id_estado LIMIT 1",
    );
    if (!estado.rows[0])
      throw new ApiError(409, 'Falta el catálogo de estados. Ejecuta la preparación de catálogos.');
    const ubicacion = await agregarUbicacion(lugar, db);
    const result = await db.query<{ id: number }>(
      'INSERT INTO reporte (id_usuario,id_categoria,id_ubicacion,id_estado,codigo,titulo,descripcion,prioridad) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id_reporte AS id',
      [
        actor.idUsuario,
        idCategoria,
        ubicacion.idUbicacion,
        estado.rows[0].id,
        'R' + randomBytes(7).toString('hex'),
        titulo,
        descripcion,
        prioridad,
      ],
    );
    await agregarSeguimiento(
      db,
      result.rows[0].id,
      actor.idUsuario,
      estado.rows[0].id,
      'Reporte registrado.',
    );
    return result.rows[0];
  });
}

export async function comentar(
  departamento: string,
  idReporte: number,
  entrada: unknown,
  actor: Actor,
) {
  const comentario = texto(objeto(entrada), 'comentario', 500);
  await transaccion(async (db) => {
    await comprobarReporte(db, departamento, idReporte, true);
    await agregarComentario(db, idReporte, actor.idUsuario, comentario);
  });
  return { id: idReporte };
}

export async function apoyar(
  departamento: string,
  idReporte: number,
  actor: Actor,
  activo: boolean,
) {
  await transaccion(async (db) => {
    await comprobarReporte(db, departamento, idReporte, true);
    await cambiarApoyo(db, { idReporte, idUsuario: actor.idUsuario }, activo);
  });
  return { id: idReporte };
}

export async function seguir(
  departamento: string,
  idReporte: number,
  entrada: unknown,
  actor: Actor,
) {
  if (!puedeGestionar(actor)) throw new ApiError(403, 'No tienes permiso para cambiar estados.');
  const data = objeto(entrada);
  const idEstado = entero(data['idEstado']);
  const idEstadoAnterior = entero(data['idEstadoAnterior']);
  const observacion = texto(data, 'observacion', 500);
  const motivoRechazo = texto(data, 'motivoRechazo', 250, false);
  return transaccion(async (db) => {
    const actual = await comprobarReporte(db, departamento, idReporte, true);
    if (actual.idEstado !== idEstadoAnterior)
      throw new ApiError(409, 'El estado cambió. Recarga el reporte antes de continuar.');
    const result = await db.query<{ nombre: string }>(
      'SELECT nombre FROM estadoreporte WHERE id_estado=$1',
      [idEstado],
    );
    if (!result.rows[0]) throw new ApiError(400, 'Estado inválido.');
    const rechazado = result.rows[0].nombre.trim().toLowerCase() === 'rechazado';
    if (rechazado && !motivoRechazo)
      throw new ApiError(400, 'El motivo de rechazo es obligatorio.');
    await agregarSeguimiento(db, idReporte, actor.idUsuario, idEstado, observacion);
    await db.query(
      'UPDATE reporte SET id_estado=$1, motivo_rechazo=$2, fecha_actualizacion=current_date WHERE id_reporte=$3',
      [idEstado, rechazado ? motivoRechazo : null, idReporte],
    );
    return { id: idReporte };
  });
}
