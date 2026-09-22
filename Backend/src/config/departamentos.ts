import { ApiError } from "../utils/apiError";

const departamentos = new Map([
    ["alta-verapaz", "Alta Verapaz"],
    ["baja-verapaz", "Baja Verapaz"],
    ["chimaltenango", "Chimaltenango"],
    ["chiquimula", "Chiquimula"],
    ["el-progreso", "El Progreso"],
    ["escuintla", "Escuintla"],
    ["guatemala", "Guatemala"],
    ["huehuetenango", "Huehuetenango"],
    ["izabal", "Izabal"],
    ["jalapa", "Jalapa"],
    ["jutiapa", "Jutiapa"],
    ["san-marcos", "San Marcos"],
    ["santa-rosa", "Santa Rosa"],
    ["solola", "Sololá"],
    ["suchitepequez", "Suchitepéquez"],
    ["totonicapan", "Totonicapán"],
    ["zacapa", "Zacapa"]
]);

export function nombreDepartamento(slug: unknown): string {
    const nombre = typeof slug === "string" ? departamentos.get(slug) : undefined;
    if (!nombre) throw new ApiError(404, "Departamento no disponible.");
    return nombre;
}
