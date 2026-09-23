import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { DatosCampana, FiltrosCampana, PanelCampanas } from '../models/campana';

@Injectable({ providedIn: 'root' })
export class CampanaService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api/campanas';
  private readonly opciones = { withCredentials: true };

  listar(filtros: FiltrosCampana) {
    const params = new HttpParams()
      .set('pagina', filtros.pagina)
      .set('busqueda', filtros.busqueda)
      .set('estado', filtros.estado);
    return this.http.get<PanelCampanas>(this.api, { ...this.opciones, params });
  }
  guardar(datos: DatosCampana, id: number | null) {
    return id === null
      ? this.http.post<{ id: number }>(this.api, datos, this.opciones)
      : this.http.put<{ id: number }>(this.api + '/' + id, datos, this.opciones);
  }
}
