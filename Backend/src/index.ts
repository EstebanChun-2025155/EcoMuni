import "dotenv/config";
import { prepararCatalogos } from "./service/catalogoService";
import { probarConexion, pool } from "./config/database";
import { iniciarServidor } from "./server/server";

async function main(): Promise<void> {
    try {
        await probarConexion();
        await prepararCatalogos();
        iniciarServidor();
    } catch (error) {
        console.error("No se pudo iniciar EcoMuni:", error);
        await pool.end();
        process.exitCode = 1;
    }
}

void main();