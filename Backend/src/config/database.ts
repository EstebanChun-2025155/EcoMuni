import { Pool } from "pg";

export const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "db_ecomuni",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD 
});

export async function probarConexion(): Promise<boolean> {
    const cliente = await pool.connect();

    try {
        await cliente.query("select 1");
        return true;
    } finally {
        cliente.release();
    }
}