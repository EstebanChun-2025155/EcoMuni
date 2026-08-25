export interface ComentarioReporte{
    idComentario: number,
    idReporte: number,
    idUsuario: number,
    comentario: string,
    fechaComentario: Date,
    estado: string
}