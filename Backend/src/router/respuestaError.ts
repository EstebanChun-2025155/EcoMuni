import { Response } from "express";

interface ErrorConCodigo {
    code?: string;
}

export function responderError(res: Response, error: unknown): void {
    const codigo = (error as ErrorConCodigo)?.code;

    if (codigo === "23505") {
        res.status(409).json({ mensaje: "El registro ya existe." });
        return;
    }

    if (codigo === "23503") {
        res.status(409).json({ mensaje: "La operación tiene registros relacionados." });
        return;
    }

    if (error instanceof Error && /obligatori|inválid|no puede|debe|formato/i.test(error.message)) {
        res.status(400).json({ mensaje: error.message });
        return;
    }

    res.status(500).json({ mensaje: "Ocurrió un error interno en el servidor." });
}