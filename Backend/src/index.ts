import 'dotenv/config';
import { pool, probarConexion } from './config/database';
import { iniciarServidor } from './server/server';
import { prepararCatalogos } from './service/catalogoService';

async function main(): Promise<void> {
  try {
    await probarConexion();
    await prepararCatalogos();
    iniciarServidor();
  } catch (error) {
    console.error('No se pudo iniciar EcoMuni:', error);
    await pool.end();
    process.exitCode = 1;
  }
}

void main();
