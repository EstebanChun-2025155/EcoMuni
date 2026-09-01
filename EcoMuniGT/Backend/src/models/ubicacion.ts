export interface Ubicacion {
    idUbicacion?: number,
    departamento: string,
    municipio: string,
    zona?: string | null,
    direccion?: string | null,
    referencia?: string | null
}
