import type { PoolClient } from 'pg';
import { pool } from './database';

export type Conexion = Pick<PoolClient, 'query'>;

export async function transaccion<T>(trabajo: (db: PoolClient) => Promise<T>): Promise<T> {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const result = await trabajo(db);
    await db.query('COMMIT');
    return result;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    db.release();
  }
}
