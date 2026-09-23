import { transaccion, type Conexion } from '../config/transaccion';

export async function prepararCatalogosEn(db: Conexion): Promise<void> {
  await db.query(
    "INSERT INTO rol (nombre) VALUES ('Ciudadano'),('Supervisor'),('Admin') ON CONFLICT(nombre) DO NOTHING",
  );
  await db.query(
    'INSERT INTO categoria(categoria) SELECT valor FROM unnest(enum_range(NULL::categoria_reporte)) AS t(valor) ON CONFLICT(categoria) DO NOTHING',
  );
  for (const nombre of ['Pendiente', 'En revisión', 'En proceso', 'Resuelto', 'Rechazado']) {
    await db.query(
      'INSERT INTO estadoreporte(nombre) SELECT $1::varchar(30) WHERE NOT EXISTS (SELECT 1 FROM estadoreporte WHERE lower(btrim(nombre))=lower($1::text)) ON CONFLICT(nombre) DO NOTHING',
      [nombre],
    );
  }
}

export async function prepararCatalogos(): Promise<void> {
  await transaccion(async (db) => {
    await db.query('SELECT pg_advisory_xact_lock(728416953)');
    await prepararCatalogosEn(db);
  });
}
