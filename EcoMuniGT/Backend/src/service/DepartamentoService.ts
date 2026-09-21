import { pool } from "../config/database";

function obtenerNombreDepartamento(slug: string): string | null {
    const departamentos: Record<string, string> = {
        "san-marcos": "San Marcos",
        "santa-rosa": "Santa Rosa",
        "solola": "Sololá",
        "suchitepequez": "Suchitepéquez",
        "totonicapan": "Totonicapán",
        "zacapa": "Zacapa"
    };

    return departamentos[slug] ?? null;
}

export async function obtenerDepartamento(
    slug: string,
    pagina: number = 1,
    idEstado?: number,
    idCategoria?: number,
    prioridad?: string
) {
    const departamento = obtenerNombreDepartamento(slug);

    if (!departamento) {
        return null;
    }

    const porPagina = 5;
    const offset = (pagina - 1) * porPagina;

    const parametros: unknown[] = [departamento];
    let numeroParametro = 2;

    let filtros = `
        WHERE u.departamento = $1
    `;

    if (idEstado !== undefined) {
        filtros += ` AND r.id_estado = $${numeroParametro}`;
        parametros.push(idEstado);
        numeroParametro++;
    }

    if (idCategoria !== undefined) {
        filtros += ` AND r.id_categoria = $${numeroParametro}`;
        parametros.push(idCategoria);
        numeroParametro++;
    }

    if (prioridad) {
        filtros += ` AND r.prioridad = $${numeroParametro}`;
        parametros.push(prioridad);
        numeroParametro++;
    }

    const resultadoReportes = await pool.query(
        `
        SELECT
            r.id_reporte AS "idReporte",
            r.id_usuario AS "idUsuario",
            r.id_categoria AS "idCategoria",
            r.id_estado AS "idEstado",
            r.codigo,
            r.titulo,
            r.descripcion,
            r.prioridad,
            er.nombre AS estado,
            c.categoria::text AS categoria,
            CONCAT_WS(
                ', ',
                u.municipio,
                CASE
                    WHEN u.zona IS NOT NULL
                    THEN 'Zona ' || u.zona
                    ELSE NULL
                END
            ) AS ubicacion,
            r.fecha_reporte AS fecha,
            r.motivo_rechazo AS "motivoRechazo",

            (
                SELECT COUNT(*)
                FROM ApoyoReporte ar
                WHERE ar.id_reporte = r.id_reporte
            ) AS apoyos,

            (
                SELECT COUNT(*)
                FROM ComentarioReporte cr
                WHERE cr.id_reporte = r.id_reporte
                  AND cr.estado = 'visible'
            ) AS "totalComentarios",

            NULL::varchar AS miniatura,

            false AS apoyado

        FROM Reporte r
        INNER JOIN Ubicacion u
            ON u.id_ubicacion = r.id_ubicacion
        INNER JOIN Categoria c
            ON c.id_categoria = r.id_categoria
        INNER JOIN EstadoReporte er
            ON er.id_estado = r.id_estado

        ${filtros}

        ORDER BY r.fecha_reporte DESC, r.id_reporte DESC
        LIMIT $${numeroParametro}
        OFFSET $${numeroParametro + 1}
        `,
        [...parametros, porPagina, offset]
    );

    const parametrosTotal: unknown[] = [departamento];
    let numeroParametroTotal = 2;

    let filtrosTotal = `
        WHERE u.departamento = $1
    `;

    if (idEstado !== undefined) {
        filtrosTotal += ` AND r.id_estado = $${numeroParametroTotal}`;
        parametrosTotal.push(idEstado);
        numeroParametroTotal++;
    }

    if (idCategoria !== undefined) {
        filtrosTotal += ` AND r.id_categoria = $${numeroParametroTotal}`;
        parametrosTotal.push(idCategoria);
        numeroParametroTotal++;
    }

    if (prioridad) {
        filtrosTotal += ` AND r.prioridad = $${numeroParametroTotal}`;
        parametrosTotal.push(prioridad);
        numeroParametroTotal++;
    }

    const resultadoTotal = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM Reporte r
        INNER JOIN Ubicacion u
            ON u.id_ubicacion = r.id_ubicacion
        ${filtrosTotal}
        `,
        parametrosTotal
    );

    const resultadoPuntos = await pool.query(
        `
        SELECT
            p.id_punto AS "idPunto",
            p.nombre,
            CONCAT_WS(
                ', ',
                u.municipio,
                CASE
                    WHEN u.zona IS NOT NULL
                    THEN 'Zona ' || u.zona
                    ELSE NULL
                END
            ) AS ubicacion,
            p.materiales,
            p.descripcion,
            p.horario,
            p.telefono
        FROM PuntoReciclaje p
        INNER JOIN Ubicacion u
            ON u.id_ubicacion = p.id_ubicacion
        WHERE u.departamento = $1
          AND p.estado = 'activo'
        ORDER BY p.id_punto
        `,
        [departamento]
    );

    const resultadoCategorias = await pool.query(
        `
        SELECT
            id_categoria AS "idCategoria",
            categoria::text AS categoria
        FROM Categoria
        WHERE estado = 'activa'
        ORDER BY id_categoria
        `
    );

    const resultadoEstados = await pool.query(
        `
        SELECT
            id_estado AS "idEstado",
            nombre
        FROM EstadoReporte
        ORDER BY id_estado
        `
    );

    return {
        reportes: resultadoReportes.rows,
        puntos: resultadoPuntos.rows,
        categorias: resultadoCategorias.rows,
        estados: resultadoEstados.rows,
        puedeGestionar: false,
        total: Number(resultadoTotal.rows[0].total),
        pagina,
        porPagina
    };
}

export async function obtenerDetalleReporte(
    slug: string,
    idReporte: number
) {
    const departamento = obtenerNombreDepartamento(slug);

    if (!departamento) {
        return null;
    }

    const resultadoReporte = await pool.query(
        `
        SELECT
            r.id_reporte AS "idReporte",
            r.id_usuario AS "idUsuario",
            r.id_categoria AS "idCategoria",
            r.id_estado AS "idEstado",
            r.codigo,
            r.titulo,
            r.descripcion,
            r.prioridad,
            er.nombre AS estado,
            c.categoria::text AS categoria,
            CONCAT_WS(
                ', ',
                u.municipio,
                CASE
                    WHEN u.zona IS NOT NULL
                    THEN 'Zona ' || u.zona
                    ELSE NULL
                END
            ) AS ubicacion,
            r.fecha_reporte AS fecha,
            r.motivo_rechazo AS "motivoRechazo",

            (
                SELECT COUNT(*)
                FROM ApoyoReporte ar
                WHERE ar.id_reporte = r.id_reporte
            ) AS apoyos,

            (
                SELECT COUNT(*)
                FROM ComentarioReporte cr
                WHERE cr.id_reporte = r.id_reporte
                  AND cr.estado = 'visible'
            ) AS "totalComentarios",

            NULL::varchar AS miniatura,

            false AS apoyado

        FROM Reporte r
        INNER JOIN Ubicacion u
            ON u.id_ubicacion = r.id_ubicacion
        INNER JOIN Categoria c
            ON c.id_categoria = r.id_categoria
        INNER JOIN EstadoReporte er
            ON er.id_estado = r.id_estado

        WHERE r.id_reporte = $1
          AND u.departamento = $2
        `,
        [idReporte, departamento]
    );

    if (resultadoReporte.rows.length === 0) {
        return null;
    }

    const resultadoComentarios = await pool.query(
        `
        SELECT
            cr.id_comentario AS "idComentario",
            CONCAT_WS(
                ' ',
                us.nombres,
                us.apellidos
            ) AS autor,
            cr.fecha_comentario AS fecha,
            cr.comentario AS texto
        FROM ComentarioReporte cr
        INNER JOIN Usuario us
            ON us.id_usuario = cr.id_usuario
        WHERE cr.id_reporte = $1
          AND cr.estado = 'visible'
        ORDER BY cr.fecha_comentario, cr.id_comentario
        `,
        [idReporte]
    );

    const resultadoSeguimientos = await pool.query(
        `
        SELECT
            s.id_seguimiento AS "idSeguimiento",
            s.id_estado AS "idEstado",
            er.nombre AS estado,
            CONCAT_WS(
                ' ',
                us.nombres,
                us.apellidos
            ) AS autor,
            s.fecha_cambio AS fecha,
            s.observacion
        FROM Seguimiento s
        INNER JOIN EstadoReporte er
            ON er.id_estado = s.id_estado
        INNER JOIN Usuario us
            ON us.id_usuario = s.id_usuario
        WHERE s.id_reporte = $1
        ORDER BY s.fecha_cambio, s.id_seguimiento
        `,
        [idReporte]
    );

    const resultadoEvidencias = await pool.query(
        `
        SELECT
            e.id_evidencia AS "idEvidencia",
            e.url_imagen AS "urlImagen",
            e.descripcion
        FROM Evidencia e
        WHERE e.id_reporte = $1
        ORDER BY e.fecha_subida, e.id_evidencia
        `,
        [idReporte]
    );

    return {
        ...resultadoReporte.rows[0],
        comentarios: resultadoComentarios.rows,
        seguimientos: resultadoSeguimientos.rows,
        evidencias: resultadoEvidencias.rows,
        puedeAdjuntar: false
    };
}

export async function crearReporte(
    slug: string,
    idUsuario: number,
    datos: {
        titulo: string;
        descripcion: string;
        idCategoria: number;
        prioridad: string;
        municipio: string;
        zona: string;
        direccion: string;
        referencia: string;
    }
): Promise<number | null> {

    const departamento = obtenerNombreDepartamento(slug);

    if (!departamento) {
        return null;
    }

    const titulo = datos.titulo.trim();
    const descripcion = datos.descripcion.trim();
    const municipio = datos.municipio.trim();
    const zona = datos.zona.trim();
    const direccion = datos.direccion.trim();
    const referencia = datos.referencia.trim();

    if (
        !titulo ||
        !descripcion ||
        !municipio
    ) {
        throw new Error("Los campos obligatorios deben completarse.");
    }

    if (
        !Number.isInteger(datos.idCategoria) ||
        datos.idCategoria <= 0
    ) {
        throw new Error("La categoría no es válida.");
    }

    if (
        !["baja", "media", "alta"].includes(datos.prioridad)
    ) {
        throw new Error("La prioridad no es válida.");
    }

    const resultadoCategoria = await pool.query(
        `
        SELECT id_categoria
        FROM Categoria
        WHERE id_categoria = $1
          AND estado = 'activa'
        `,
        [datos.idCategoria]
    );

    if (resultadoCategoria.rows.length === 0) {
        throw new Error("La categoría no existe o está inactiva.");
    }

    const resultadoEstado = await pool.query(
        `
        SELECT id_estado
        FROM EstadoReporte
        WHERE nombre = 'Pendiente'
        `
    );

    if (resultadoEstado.rows.length === 0) {
        throw new Error("No existe el estado Pendiente.");
    }

    const resultadoUbicacion = await pool.query(
        `
        SELECT id_ubicacion AS "idUbicacion"
        FROM Ubicacion
        WHERE departamento = $1
          AND municipio = $2
          AND COALESCE(zona, '') = $3
          AND COALESCE(direccion, '') = $4
          AND COALESCE(referencia, '') = $5
        LIMIT 1
        `,
        [
            departamento,
            municipio,
            zona,
            direccion,
            referencia
        ]
    );

    let idUbicacion: number;

    if (resultadoUbicacion.rows.length > 0) {
        idUbicacion = resultadoUbicacion.rows[0].idUbicacion;
    } else {
        const nuevaUbicacion = await pool.query(
            `
            INSERT INTO Ubicacion (
                departamento,
                municipio,
                zona,
                direccion,
                referencia
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_ubicacion AS "idUbicacion"
            `,
            [
                departamento,
                municipio,
                zona || null,
                direccion || null,
                referencia || null
            ]
        );

        idUbicacion = nuevaUbicacion.rows[0].idUbicacion;
    }

    const codigo = await generarCodigoReporte();

    const resultado = await pool.query(
        `
        INSERT INTO Reporte (
            id_usuario,
            id_categoria,
            id_ubicacion,
            id_estado,
            codigo,
            titulo,
            descripcion,
            prioridad
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id_reporte AS "idReporte"
        `,
        [
            idUsuario,
            datos.idCategoria,
            idUbicacion,
            resultadoEstado.rows[0].id_estado,
            codigo,
            titulo,
            descripcion,
            datos.prioridad
        ]
    );

    return resultado.rows[0].idReporte;
}

async function generarCodigoReporte(): Promise<string> {

    for (let intento = 0; intento < 10; intento++) {

        const numero = Math.floor(
            100000 + Math.random() * 900000
        );

        const codigo = `REP-${numero}`;

        const resultado = await pool.query(
            `
            SELECT 1
            FROM Reporte
            WHERE codigo = $1
            `,
            [codigo]
        );

        if (resultado.rows.length === 0) {
            return codigo;
        }
    }

    throw new Error(
        "No fue posible generar un código único para el reporte."
    );
}