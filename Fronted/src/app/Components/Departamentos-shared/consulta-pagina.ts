import { DestroyRef, Directive, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, catchError, finalize, switchMap } from 'rxjs';
import { ConsultaService } from '../../Service/consulta.service';
import { AuthService } from '../../Service/auth.service';
import { DepartamentoService } from '../../Service/departamento.service';
import type { Pagina } from '../../models/consulta';
@Directive()
export abstract class ConsultaPagina<T> {
 private readonly servicio=inject(ConsultaService);
 private readonly auth=inject(AuthService);
 private readonly router=inject(Router);
 private readonly destroyRef=inject(DestroyRef);
 readonly api=inject(DepartamentoService);
 private readonly paginasSolicitadas=new BehaviorSubject(1);
 readonly datos=signal<Pagina<T>>({items:[],total:0,pagina:1,porPagina:12});
 readonly cargando=signal(false);
 readonly error=signal('');
 readonly cerrando=signal(false);
 readonly enlaces=[{ruta:'/home',nombre:'Departamentos'},{ruta:'/reports',nombre:'Reportes'},{ruta:'/categories',nombre:'Categorías'},{ruta:'/evidences',nombre:'Evidencias'},{ruta:'/locations',nombre:'Ubicaciones'}];
 constructor(recurso:'reportes'|'categorias'|'evidencias'|'ubicaciones') {
  this.paginasSolicitadas.pipe(switchMap(pagina=>{
   this.cargando.set(true);this.error.set('');
   return this.servicio.listar<T>(recurso,pagina).pipe(catchError(error=>{this.informar(error);return EMPTY;}),finalize(()=>this.cargando.set(false)));
  }),takeUntilDestroyed(this.destroyRef)).subscribe(datos=>this.datos.set(datos));
 }
 get paginas():number {return Math.max(1,Math.ceil(this.datos().total/this.datos().porPagina));}
 cambiarPagina(delta:number):void {
  const pagina=this.datos().pagina+delta;
  if(!this.cargando()&&pagina>=1&&pagina<=this.paginas)this.paginasSolicitadas.next(pagina);
 }
 recargar():void {if(!this.cargando())this.paginasSolicitadas.next(this.paginasSolicitadas.value);}
 cerrarSesion():void {
  if(this.cerrando())return;
  this.cerrando.set(true);
  this.auth.logout().pipe(takeUntilDestroyed(this.destroyRef),finalize(()=>this.cerrando.set(false))).subscribe({next:()=>{void this.router.navigateByUrl('/login');},error:error=>this.informar(error)});
 }
 private informar(error:unknown):void {
  this.error.set(error instanceof HttpErrorResponse&&typeof error.error?.mensaje==='string'?error.error.mensaje:'No se pudo conectar con el servidor. Inténtalo nuevamente.');
  if(error instanceof HttpErrorResponse&&error.status===401)void this.router.navigateByUrl('/login');
 }
}
