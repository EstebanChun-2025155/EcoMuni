import type { Response } from "express";
import { ApiError } from "../utils/apiError.js";
export function responderError(res: Response, error: unknown): void {
    if(error instanceof ApiError){res.status(error.status).json({mensaje:error.message});return;}
    const codigo=(error as {code?:string})?.code;
    if(codigo==='23505'){res.status(409).json({mensaje:'El registro ya existe.'});return;}
    if(codigo==='23503'){res.status(409).json({mensaje:'La operación tiene registros relacionados.'});return;}
    if(['22P02','22001','23502','23514'].includes(codigo??'')){res.status(400).json({mensaje:'Los datos enviados no cumplen las restricciones del registro.'});return;}
    if(error instanceof Error&&/obligatori|inválid|no puede|debe|formato|solo|sólo|contraseña/i.test(error.message)){res.status(400).json({mensaje:error.message});return;}
    res.status(500).json({mensaje:'Ocurrió un error interno en el servidor.'});
}
