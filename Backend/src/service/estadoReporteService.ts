import { pool } from '../config/database';
import type { EstadoReporte } from '../models/estadoReporte';
import { validarEstadoReporte } from '../utils/validations/estadoReporteValidaciones';

export interface EntradaEstado {
  nombre: string;
  descripcion?: string | null;
}

function validarId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

function validarDatosEstado(datos: EntradaEstado): EntradaEstado {
  const errores = validarEstadoReporte(datos.nombre, datos.descripcion);
  if (errores.length > 0) throw new Error(errores.join(' '));

  return {
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion?.trim() || null,
  };
}

export async function listarEstados(): Promise<EstadoReporte[]> {
  const result = await pool.query<EstadoReporte>(
    'SELECT id_estado AS "idEstado", nombre, descripcion FROM estadoreporte ORDER BY id_estado',
  );
  return result.rows;
}

export async function buscarEstado(id: number): Promise<EstadoReporte | null> {
  if (!validarId(id)) throw new Error('ID inválido.');

  const result = await pool.query<EstadoReporte>(
    'SELECT id_estado AS "idEstado", nombre, descripcion FROM estadoreporte WHERE id_estado = $1',
    [id],
  );
  return result.rows[0] || null;
}

export async function agregarEstado(datos: EntradaEstado): Promise<EstadoReporte> {
  const nuevo = validarDatosEstado(datos);

  const result = await pool.query<EstadoReporte>(
    'INSERT INTO estadoreporte (nombre, descripcion) VALUES ($1, $2) RETURNING id_estado AS "idEstado", nombre, descripcion',
    [nuevo.nombre, nuevo.descripcion ?? null],
  );
  return result.rows[0];
}

export async function actualizarEstado(
  id: number,
  datos: EntradaEstado,
): Promise<EstadoReporte | null> {
  if (!validarId(id)) throw new Error('ID inválido.');

  const actualizado = validarDatosEstado(datos);

  const result = await pool.query<EstadoReporte>(
    'UPDATE estadoreporte SET nombre = $1, descripcion = $2 WHERE id_estado = $3 RETURNING id_estado AS "idEstado", nombre, descripcion',
    [actualizado.nombre, actualizado.descripcion ?? null, id],
  );
  return result.rows[0] || null;
}

export async function eliminarEstado(id: number): Promise<EstadoReporte | null> {
  if (!validarId(id)) throw new Error('ID inválido.');

  const result = await pool.query<EstadoReporte>(
    'DELETE FROM estadoreporte WHERE id_estado = $1 RETURNING id_estado AS "idEstado", nombre, descripcion',
    [id],
  );
  return result.rows[0] || null;
}
