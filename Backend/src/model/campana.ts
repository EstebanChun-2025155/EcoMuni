export type EstadoCampana = 'borrador' | 'publicada' | 'finalizada' | 'cancelada';

export interface Campana {
    id_campana?: number;
    id_usuario: number;
    id_ubicacion?: number | null;
    titulo: string;
    descripcion: string;
    organizador: string;
    fecha_inicio: Date | string;
    fecha_fin: Date | string;
    imagen_url?: string | null;
    estado?: EstadoCampana;
}
