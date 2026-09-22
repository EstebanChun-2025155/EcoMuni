import { objeto } from "../utils/apiError.js";
import { pool } from "../config/database.js";
import { Categoria } from "../models/categoria.js";
import { validarCategoria } from "../utils/validaciones.js";

function validarId(id: number): boolean {
    return Number.isSafeInteger(id) && id > 0 && id <= 2147483647;
}

function validarDatosCategoria(categoria: Categoria): Categoria {
    objeto(categoria);
    const errores = validarCategoria(
        categoria.categoria,
        categoria.descripcion ,
        categoria.estado  
    );

    if (errores.length > 0) {
        throw new Error(errores.join(" "));
    }

    return {
        ...categoria,
        categoria: categoria.categoria.trim(),
        descripcion: categoria.descripcion?.trim() || null,
        estado: categoria.estado
    };
}

export async function listarCategorias(): Promise<Categoria[]> {
    const resultado = await pool.query<Categoria>(
        `select id_categoria as "idCategoria", categoria, descripcion, estado
         from categoria
         order by id_categoria`
    );

    return resultado.rows;
}

export async function buscarCategoria(id: number): Promise<Categoria | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Categoria>(
        `select id_categoria as "idCategoria", categoria, descripcion, estado
         from categoria
         where id_categoria = $1`,
        [id]
    );

    return resultado.rows[0] || null;
}

export async function agregarCategoria(categoria: Categoria): Promise<Categoria> {
    const nuevaCategoria = validarDatosCategoria(categoria);

    const resultado = await pool.query<Categoria>(
        `insert into categoria (categoria, descripcion, estado)
         values ($1, $2, $3)
         returning id_categoria as "idCategoria", categoria, descripcion, estado`,
        [nuevaCategoria.categoria, nuevaCategoria.descripcion, nuevaCategoria.estado]
    );

    return resultado.rows[0];
}

export async function actualizarCategoria(
    id: number,
    datos: Categoria
): Promise<Categoria | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    objeto(datos);
    if (datos.idCategoria !== undefined && datos.idCategoria !== id) {
        throw new Error("No se puede modificar el ID de la categoría.");
    }

    const categoriaActualizada = validarDatosCategoria(datos);

    const resultado = await pool.query<Categoria>(
        `update categoria
         set categoria = $1, descripcion = $2, estado = $3
         where id_categoria = $4
         returning id_categoria as "idCategoria", categoria, descripcion, estado`,
        [categoriaActualizada.categoria, categoriaActualizada.descripcion, categoriaActualizada.estado, id]
    );

    return resultado.rows[0] || null;
}

export async function eliminarCategoria(id: number): Promise<Categoria | null> {
    if (!validarId(id)) {
        throw new Error("ID inválido.");
    }

    const resultado = await pool.query<Categoria>(
        `update categoria set estado = 'inactiva'
         where id_categoria = $1
         returning id_categoria as "idCategoria", categoria, descripcion, estado`,
        [id]
    );

    return resultado.rows[0] || null;
}
export async function listarCategoriasActivas(): Promise<Categoria[]> {
 return (await pool.query<Categoria>(`SELECT id_categoria AS "idCategoria", categoria, descripcion, estado FROM categoria WHERE estado='activa' ORDER BY id_categoria`)).rows;
}
