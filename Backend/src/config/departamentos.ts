import { ApiError } from "../utils/apiError.js";


const departamentos = new Map<string, string>([
    ["peten", "Petén"],
    ["quetzaltenango", "Quetzaltenango"],
    ["quiche", "Quiché"],
    ["retalhuleu", "Retalhuleu"],
    ["sacatepequez", "Sacatepéquez"]
]);

export function nombreDepartamento(slug: unknown): string {
    const nombre = typeof slug === "string" ? departamentos.get(slug) : undefined;
    if (!nombre) throw new ApiError(404, "Departamento no disponible.");
    return nombre;
}