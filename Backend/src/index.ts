import "dotenv/config";
import { prepararCatalogos } from "./service/catalogoService.js";
import { probarConexion, pool } from "./config/database.js";
import { iniciarServidor } from "./server/server.js";

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