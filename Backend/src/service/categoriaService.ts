import { pool } from "../config/database";
import type { Categoria } from "../models/categoria";

export async function listarCategorias(): Promise<Categoria[]> {
    const result = await pool.query<Categoria>("SELECT id_categoria AS \"idCategoria\", categoria, descripcion, estado FROM categoria WHERE estado = 'activa' ORDER BY categoria");
    return result.rows;
}
