import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface SeguimientoReporte {
  idSeguimiento: number;
  idReporte: number;
  titulo: string;
  departamento: string;
  slug: string;
  estado: string;
  observacion: string | null;
  fecha: string;
}

@Injectable({ providedIn: 'root' })
export class SeguimientoService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api/seguimientos';
  private readonly opciones = { withCredentials: true };

  listar() {
    return this.http.get<SeguimientoReporte[]>(this.api, this.opciones);
  }
}
