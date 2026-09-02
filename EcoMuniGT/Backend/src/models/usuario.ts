export type EstadoUsuario = "activo" | "suspendido";

export interface Usuario {
    idUsuario?: number,
    idRol: number,
    nombres: string,
    apellidos: string,
    correo: string,
    contrasena?: string,
    telefono?: string | null,
    estado: EstadoUsuario,
    fechaRegistro?: Date
}
