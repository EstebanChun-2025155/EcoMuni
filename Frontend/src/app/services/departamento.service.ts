import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type {
  DetalleReporte,
  FiltrosReporte,
  NuevoPunto,
  NuevoReporte,
  PanelDepartamento,
} from '../models/departamento';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private readonly http = inject(HttpClient);
  private readonly origen = 'http://localhost:3000';
  private readonly api = this.origen + '/api/departamentos/';
  private readonly opciones = { withCredentials: true };

  cargar(slug: string, filtros: FiltrosReporte) {
    let params = new HttpParams().set('pagina', filtros.pagina);
    if (filtros.idCategoria) params = params.set('idCategoria', filtros.idCategoria);
    if (filtros.idEstado) params = params.set('idEstado', filtros.idEstado);
    if (filtros.prioridad) params = params.set('prioridad', filtros.prioridad);
    return this.http.get<PanelDepartamento>(this.api + slug, { ...this.opciones, params });
  }
  detalle(slug: string, id: number) {
    return this.http.get<DetalleReporte>(this.api + slug + '/reportes/' + id, this.opciones);
  }
  crear(slug: string, datos: NuevoReporte) {
    return this.http.post<{ id: number }>(this.api + slug + '/reportes', datos, this.opciones);
  }
  comentar(slug: string, id: number, comentario: string) {
    return this.http.post<{ id: number }>(
      this.api + slug + '/reportes/' + id + '/comentarios',
      { comentario },
      this.opciones,
    );
  }
  seguir(slug: string, id: number, datos: object) {
    return this.http.post<{ id: number }>(
      this.api + slug + '/reportes/' + id + '/seguimientos',
      datos,
      this.opciones,
    );
  }
  apoyar(slug: string, id: number, activo: boolean) {
    const url = this.api + slug + '/reportes/' + id + '/apoyo';
    return activo
      ? this.http.post<{ id: number }>(url, {}, this.opciones)
      : this.http.delete<{ id: number }>(url, this.opciones);
  }
  crearPunto(slug: string, datos: NuevoPunto) {
    return this.http.post<{ id: number }>(this.api + slug + '/puntos', datos, this.opciones);
  }
  subirEvidencia(slug: string, id: number, archivo: File, descripcion: string) {
    return this.http.post<{ id: number }>(
      this.api + slug + '/reportes/' + id + '/evidencias',
      archivo,
      {
        ...this.opciones,
        params: new HttpParams().set('descripcion', descripcion),
        headers: { 'Content-Type': archivo.type },
      },
    );
  }
  describirEvidencia(slug: string, id: number, idEvidencia: number, descripcion: string) {
    return this.http.patch<{ id: number }>(
      this.api + slug + '/reportes/' + id + '/evidencias/' + idEvidencia,
      { descripcion },
      this.opciones,
    );
  }
  urlImagen(url: string | null): string {
    if (!url) return '';
    if (url.startsWith('/api/archivos/')) return this.origen + url;
    if (/^https?:\/\//i.test(url)) return url;

    return url.startsWith('/') && !url.startsWith('//') ? url : '';
  }
}
