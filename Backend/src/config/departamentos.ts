
import { ApiError } from "../utils/apiError";

const departamentos = new Map([
    ["peten", "Peten"],
    ["quetaltenago", "Quetzaltenango"],
    ["quiche", "Quiche"],
    ["retalhuleu", "Retalhuleu"],
    ["sacatepequez", "Sacatepéquez"]
]);

export function nombreDepartamento(slug: unknown): string {
    const nombre = typeof slug === "string" ? departamentos.get(slug) : undefined;
    if (!nombre) throw new ApiError(404, "Departamento no disponible.");
    return nombre;
}