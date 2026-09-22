import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Pagina } from '../models/consulta';
@Injectable({providedIn:'root'})
export class ConsultaService {
 private readonly http=inject(HttpClient);
 listar<T>(recurso:'reportes'|'categorias'|'evidencias'|'ubicaciones',pagina:number) {
  return this.http.get<Pagina<T>>('http://localhost:3000/api/consulta/'+recurso,{withCredentials:true,params:{pagina}});
 }
}
