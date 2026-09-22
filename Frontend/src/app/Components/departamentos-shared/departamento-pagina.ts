import { DestroyRef, Directive, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Observable, Subject, catchError, finalize, startWith, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DepartamentoService } from '../../services/departamento.service';
import type { DetalleReporte, FiltrosReporte, NuevoPunto, NuevoReporte, PanelDepartamento, PortadaDepartamento, Reporte } from '../../models/departamento';

function reporteVacio(): NuevoReporte {
  return { titulo: '', descripcion: '', idCategoria: null, prioridad: 'media', municipio: '', zona: '', direccion: '', referencia: '' };
}
function puntoVacio(): NuevoPunto {
  return { nombre: '', materiales: '', municipio: '', zona: '', direccion: '', referencia: '', descripcion: '', horario: '', telefono: '' };
}

@Directive()
export abstract class DepartamentoPagina {
  readonly auth = inject(AuthService);
  readonly api = inject(DepartamentoService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly recargas = new Subject<void>();
  private readonly seleccion = new BehaviorSubject<number | null>(null);

  readonly panel = signal<PanelDepartamento | null>(null);
  readonly detalle = signal<DetalleReporte | null>(null);
  readonly cargando = signal(false);
  readonly cargandoDetalle = signal(false);
  readonly guardando = signal(false);
  readonly cerrando = signal(false);
  readonly error = signal('');
  readonly errorDetalle = signal('');
  readonly mensaje = signal('');
  readonly menuAbierto = signal(true);
  readonly mostrarNuevoReporte = signal(false);
  readonly mostrarNuevoPunto = signal(false);

  filtros: FiltrosReporte = { pagina: 1, idEstado: null, idCategoria: null, prioridad: '' };
  nuevoReporte = reporteVacio();
  nuevoPunto = puntoVacio();
  comentarioNuevo = '';
  nuevoSeguimiento = { idEstado: null as number | null, observacion: '', motivoRechazo: '' };
  archivo: File | null = null;
  descripcionEvidencia = '';
  descripcionesEvidencias: Record<number, string> = {};
  constructor(readonly departamento: PortadaDepartamento) {
    this.recargas.pipe(
      startWith(undefined),
      switchMap(() => {
        this.cargando.set(true);
        this.error.set('');
        return this.api.cargar(departamento.slug, { ...this.filtros }).pipe(
          catchError(error => { this.informarError(error); return EMPTY; }),
          finalize(() => this.cargando.set(false))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(panel => this.panel.set(panel));

    this.seleccion.pipe(
      switchMap(id => {
        this.detalle.set(null);
        this.errorDetalle.set('');
        this.archivo = null;
        this.descripcionEvidencia = '';
        if (id === null) return EMPTY;
        this.cargandoDetalle.set(true);
        return this.api.detalle(departamento.slug, id).pipe(
          catchError(error => {
            this.errorDetalle.set(this.mensajeError(error));
            this.redirigirSiExpirada(error);
            return EMPTY;
          }),
          finalize(() => this.cargandoDetalle.set(false))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(detalle => {
      this.detalle.set(detalle);
      this.descripcionesEvidencias = Object.fromEntries(detalle.evidencias.map(e => [e.idEvidencia, e.descripcion ?? '']));
      this.nuevoSeguimiento = { idEstado: detalle.idEstado, observacion: '', motivoRechazo: '' };
    });
  }

  get puedeGestionar(): boolean { return this.panel()?.puedeGestionar ?? false; }
  get paginas(): number {
    const panel = this.panel();
    return panel ? Math.max(1, Math.ceil(panel.total / panel.porPagina)) : 1;
  }

  alternarMenu(): void { this.menuAbierto.update(valor => !valor); }
  volverHome(): void { void this.router.navigateByUrl('/home'); }
  irReportes(): void { document.getElementById('reportes')?.scrollIntoView({ behavior: 'smooth' }); }

  recargar(): void {
    if (this.guardando()) return;
    this.recargas.next();
    if (this.seleccion.value !== null) this.seleccion.next(this.seleccion.value);
  }

  aplicarFiltros(): void {
    this.filtros.pagina = 1;
    this.panel.update(panel => panel ? { ...panel, reportes: [], total: 0 } : null);
    this.recargas.next();
  }

  cambiarPagina(delta: number): void {
    if (this.cargando() || this.guardando()) return;
    const siguiente = this.filtros.pagina + delta;
    if (siguiente < 1 || siguiente > this.paginas) return;
    this.filtros.pagina = siguiente;
    this.recargas.next();
  }

  abrirDetalle(reporte: Reporte): void {
    if (this.guardando()) return;
    this.comentarioNuevo = '';
    this.seleccion.next(reporte.idReporte);
  }

  cerrarDetalle(): void {
    if (!this.guardando()) this.seleccion.next(null);
  }

  abrirNuevoReporte(): void {
    this.error.set('');
    this.mostrarNuevoReporte.set(true);
  }

  cerrarNuevoReporte(): void {
    if (!this.guardando()) this.mostrarNuevoReporte.set(false);
  }

  registrarReporte(): void {
    this.guardar(
      this.api.crear(this.departamento.slug, { ...this.nuevoReporte }),
      resultado => {
        this.nuevoReporte = reporteVacio();
        this.mostrarNuevoReporte.set(false);
        this.filtros = { pagina: 1, idEstado: null, idCategoria: null, prioridad: '' };
        this.seleccion.next(resultado.id);
      },
      'Reporte guardado. Puedes adjuntar fotografías desde su detalle.'
    );
  }

  agregarComentario(): void {
    const detalle = this.detalle();
    const comentario = this.comentarioNuevo.trim();
    if (!detalle || !comentario) return;
    this.guardar(this.api.comentar(this.departamento.slug, detalle.idReporte, comentario),
      () => { this.comentarioNuevo = ''; this.seleccion.next(detalle.idReporte); });
  }

  alternarApoyo(): void {
    const detalle = this.detalle();
    if (!detalle) return;
    this.guardar(this.api.apoyar(this.departamento.slug, detalle.idReporte, !detalle.apoyado),
      () => this.seleccion.next(detalle.idReporte));
  }

  registrarSeguimiento(): void {
    const detalle = this.detalle();
    if (!detalle || !this.puedeGestionar) return;
    this.guardar(this.api.seguir(this.departamento.slug, detalle.idReporte, {
      ...this.nuevoSeguimiento, idEstadoAnterior: detalle.idEstado
    }), () => this.seleccion.next(detalle.idReporte));
  }

  seleccionarArchivo(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;
    this.archivo = null;
    if (!archivo) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(archivo.type) || archivo.size > 5 * 1024 * 1024 || archivo.size === 0) {
      this.error.set('Selecciona una imagen PNG, JPEG o WebP de hasta 5 MB.');
      input.value = '';
      return;
    }
    this.error.set('');
    this.archivo = archivo;
  }

  subirEvidencia(): void {
    const detalle = this.detalle();
    if (!detalle || !this.archivo || !detalle.puedeAdjuntar) return;
    this.guardar(this.api.subirEvidencia(this.departamento.slug, detalle.idReporte, this.archivo, this.descripcionEvidencia),
      () => this.seleccion.next(detalle.idReporte), 'Evidencia guardada.');
  }

  registrarPunto(): void {
    if (!this.puedeGestionar) return;
    this.guardar(this.api.crearPunto(this.departamento.slug, { ...this.nuevoPunto }), () => {
      this.nuevoPunto = puntoVacio();
      this.mostrarNuevoPunto.set(false);
    }, 'Punto de reciclaje guardado.');
  }

  guardarDescripcionEvidencia(idEvidencia: number): void {
    const detalle = this.detalle();
    if (!detalle?.puedeAdjuntar) return;
    this.guardar(this.api.describirEvidencia(this.departamento.slug, detalle.idReporte, idEvidencia, this.descripcionesEvidencias[idEvidencia] ?? ''),
      () => this.seleccion.next(detalle.idReporte), 'Descripción guardada.');
  }

  cerrarSesion(): void {
    if (this.cerrando() || this.guardando()) return;
    this.cerrando.set(true);
    this.auth.logout().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.cerrando.set(false))
    ).subscribe({
      next: () => { void this.router.navigateByUrl('/login', { replaceUrl: true }); },
      error: error => this.informarError(error)
    });
  }

  private guardar(peticion: Observable<{ id: number }>, alGuardar: (r: { id: number }) => void, mensaje = 'Cambios guardados correctamente.'): void {
    if (this.guardando() || this.cargando() || this.cargandoDetalle()) return;
    this.guardando.set(true);
    this.error.set('');
    this.mensaje.set('');
    peticion.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.guardando.set(false))
    ).subscribe({
      next: resultado => {
        alGuardar(resultado);
        this.mensaje.set(mensaje);
        this.recargas.next();
      },
      error: error => this.informarError(error)
    });
  }

  private mensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'No se pudo conectar con el servidor. Comprueba que el backend esté iniciado.';
      if (typeof error.error?.mensaje === 'string') return error.error.mensaje;
    }
    return 'No fue posible completar la operación.';
  }

  private redirigirSiExpirada(error: unknown): void {
    if (error instanceof HttpErrorResponse && error.status === 401) void this.router.navigateByUrl('/login');
  }

  private informarError(error: unknown): void {
    this.error.set(this.mensajeError(error));
    this.redirigirSiExpirada(error);
  }
}
