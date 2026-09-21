import bcrypt from "bcryptjs";

async function main(): Promise<void> {
    console.log("Admin:", await bcrypt.hash("Admin123!", 12));
    console.log("Gestor:", await bcrypt.hash("Gestor123!", 12));
    console.log("Ciudadano:", await bcrypt.hash("EcoMuni123!", 12));
}

void main();