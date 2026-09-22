import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Pagina } from '../models/consulta';

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api/consulta/';
  private readonly opciones = { withCredentials: true };

  listar<T>(recurso: 'reportes' | 'categorias' | 'evidencias' | 'ubicaciones', pagina: number) {
    return this.http.get<Pagina<T>>(this.api + recurso, { ...this.opciones, params: { pagina } });
  }
}
