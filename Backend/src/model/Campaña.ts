export interface Campana {
    id_campana: number,
    id_usuario: number,
    id_ubicacion: number,
    titulo: string,
    descripcion: string,
    organizador: string,
    fecha_inicio: Date,
    fecha_fin: Date,
    imagen_url: string,
    estado: boolean
}