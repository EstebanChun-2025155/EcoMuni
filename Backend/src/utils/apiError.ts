export class ApiError extends Error {
    constructor(public readonly status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

export function objeto(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new ApiError(400, "Envía un objeto JSON válido.");
    }
    return value as Record<string, unknown>;
}

export function texto(data: Record<string, unknown>, key: string, max: number, required = true): string {
    const value = data[key];
    if (value == null && !required) return "";
    if (typeof value !== "string") throw new ApiError(400, key + ": texto inválido.");
    const clean = value.trim();
    if ((required && !clean) || clean.length > max || clean.includes("\0")) {
        throw new ApiError(400, key + ": " + (required ? "es obligatorio y " : "") + "admite hasta " + max + " caracteres.");
    }
    return clean;
}

export function entero(value: unknown, label = "ID"): number {
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1 || value > 2147483647) {
        throw new ApiError(400, label + " inválido.");
    }
    return value;
}

export function idParametro(value: unknown): number {
    if (typeof value !== "string" || !/^[1-9][0-9]*$/.test(value)) throw new ApiError(400, "ID inválido.");
    return entero(Number(value));
}

export function datosUbicacion(data: Record<string, unknown>, departamento: string) {
    return {
        departamento,
        municipio: texto(data, "municipio", 80),
        zona: texto(data, "zona", 15, false),
        direccion: texto(data, "direccion", 200, false),
        referencia: texto(data, "referencia", 200, false)
    };
}