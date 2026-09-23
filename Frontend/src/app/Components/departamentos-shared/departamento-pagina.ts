import { DestroyRef, Directive, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  catchError,
  finalize,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import { DepartamentoService } from '../../services/departamento.service';
import type {
  DetalleReporte,
  FiltrosReporte,
  NuevoPunto,
  NuevoReporte,
  PanelDepartamento,
  PortadaDepartamento,
  Reporte,
} from '../../models/departamento';

function reporteVacio(): NuevoReporte {
  return {
    titulo: '',
    descripcion: '',
    idCategoria: null,
    prioridad: 'media',
    municipio: '',
    zona: '',
    direccion: '',
    referencia: '',
  };
}
function puntoVacio(): NuevoPunto {
  return {
    nombre: '',
    materiales: '',
    municipio: '',
    zona: '',
    direccion: '',
    referencia: '',
    descripcion: '',
    horario: '',
    telefono: '',
  };
}

@Directive()
export abstract class DepartamentoPagina implements OnDestroy {
  readonly api = inject(DepartamentoService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly recargas = new Subject<void>();
  private readonly seleccion = new BehaviorSubject<number | null>(null);
  private temporizador?: ReturnType<typeof setTimeout>;

  readonly panel = signal<PanelDepartamento | null>(null);
  readonly detalle = signal<DetalleReporte | null>(null);
  readonly cargando = signal(false);
  readonly cargandoDetalle = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly errorDetalle = signal('');
  readonly mensaje = signal('');
  readonly notificacion = signal('');
  readonly notificacionVisible = signal(false);
  readonly notificacionExito = signal(false);
  readonly editandoEvidencia = signal<number | null>(null);
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
    this.recargas
      .pipe(
        startWith(undefined),
        switchMap(() => {
          this.cargando.set(true);
          this.error.set('');
          return this.api.cargar(departamento.slug, { ...this.filtros }).pipe(
            catchError((error) => {
              this.informarError(error);
              return EMPTY;
            }),
            finalize(() => this.cargando.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((panel) => this.panel.set(panel));

    this.seleccion
      .pipe(
        switchMap((id) => {
          this.detalle.set(null);
          this.errorDetalle.set('');
          this.archivo = null;
          this.descripcionEvidencia = '';
          if (id === null) return EMPTY;
          this.cargandoDetalle.set(true);
          return this.api.detalle(departamento.slug, id).pipe(
            catchError((error) => {
              this.errorDetalle.set(this.mensajeError(error));
              this.redirigirSiExpirada(error);
              return EMPTY;
            }),
            finalize(() => this.cargandoDetalle.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((detalle) => {
        this.detalle.set(detalle);
        this.descripcionesEvidencias = Object.fromEntries(
          detalle.evidencias.map((e) => [e.idEvidencia, e.descripcion ?? '']),
        );
        this.nuevoSeguimiento = { idEstado: detalle.idEstado, observacion: '', motivoRechazo: '' };
      });
  }

  ngOnDestroy(): void {
    if (this.temporizador) clearTimeout(this.temporizador);
  }

  get puedeGestionar(): boolean {
    return this.panel()?.puedeGestionar ?? false;
  }
  get paginas(): number {
    const panel = this.panel();
    return panel ? Math.max(1, Math.ceil(panel.total / panel.porPagina)) : 1;
  }

  volverDepartamentos(): void {
    void this.router.navigateByUrl('/departamentos');
  }

  recargar(): void {
    if (this.guardando()) return;
    this.recargas.next();
    if (this.seleccion.value !== null) this.seleccion.next(this.seleccion.value);
  }

  aplicarFiltros(): void {
    this.filtros.pagina = 1;
    this.panel.update((panel) => (panel ? { ...panel, reportes: [], total: 0 } : null));
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
    this.editandoEvidencia.set(null);
    this.seleccion.next(reporte.idReporte);
  }

  cerrarDetalle(): void {
    if (!this.guardando()) {
      this.editandoEvidencia.set(null);
      this.seleccion.next(null);
    }
  }

  abrirNuevoReporte(): void {
    this.error.set('');
    this.mostrarNuevoReporte.set(true);
  }

  cerrarNuevoReporte(): void {
    if (!this.guardando()) this.mostrarNuevoReporte.set(false);
  }

  private notificar(texto: string, exito = false): void {
    this.notificacionExito.set(exito);
    this.notificacion.set(texto);
    this.notificacionVisible.set(true);
    if (this.temporizador) clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.notificacionVisible.set(false), 4000);
  }

  private faltanCampos(): void {
    this.notificar('Completa correctamente los campos obligatorios.');
  }

  registrarReporte(): void {
    const titulo = this.nuevoReporte.titulo.trim();
    const municipio = this.nuevoReporte.municipio.trim();
    const zona = this.nuevoReporte.zona.trim();
    const direccion = this.nuevoReporte.direccion.trim();
    const referencia = this.nuevoReporte.referencia.trim();
    const descripcion = this.nuevoReporte.descripcion.trim();

    if (!titulo) {
      this.faltanCampos();
      return;
    }
    if (titulo.length < 5) {
      this.notificar('El título debe tener mínimo 5 caracteres.');
      return;
    }
    if (!/[\p{L}]/u.test(titulo)) {
      this.notificar('El título debe ser texto, no números.');
      return;
    }
    if (!municipio) {
      this.faltanCampos();
      return;
    }
    if (/\d/.test(municipio)) {
      this.notificar('El municipio debe ser texto, no números.');
      return;
    }
    if (zona && !/^[0-9A-Za-z -]+$/.test(zona)) {
      this.notificar('Zona inválida.');
      return;
    }
    if (direccion && /^\d+$/.test(direccion)) {
      this.notificar('La dirección debe ser texto, no números.');
      return;
    }
    if (referencia && /^\d+$/.test(referencia)) {
      this.notificar('La referencia debe ser texto, no números.');
      return;
    }
    if (!descripcion) {
      this.faltanCampos();
      return;
    }
    if (descripcion.length < 10) {
      this.notificar('La descripción debe tener mínimo 10 caracteres.');
      return;
    }
    if (!/[\p{L}]/u.test(descripcion)) {
      this.notificar('La descripción debe contener texto.');
      return;
    }

    this.guardar(
      this.api.crear(this.departamento.slug, { ...this.nuevoReporte }),
      (resultado) => {
        this.nuevoReporte = reporteVacio();
        this.mostrarNuevoReporte.set(false);
        this.filtros = { pagina: 1, idEstado: null, idCategoria: null, prioridad: '' };
        this.seleccion.next(resultado.id);
      },
      'Reporte guardado. Puedes adjuntar fotografías desde su detalle.',
    );
  }

  agregarComentario(): void {
    const detalle = this.detalle();
    const comentario = this.comentarioNuevo.trim();
    if (!detalle || !comentario) return;
    this.guardar(this.api.comentar(this.departamento.slug, detalle.idReporte, comentario), () => {
      this.comentarioNuevo = '';
      this.seleccion.next(detalle.idReporte);
    });
  }

  alternarApoyo(): void {
    const detalle = this.detalle();
    if (!detalle) return;
    this.guardar(this.api.apoyar(this.departamento.slug, detalle.idReporte, !detalle.apoyado), () =>
      this.seleccion.next(detalle.idReporte),
    );
  }

  registrarSeguimiento(): void {
    const detalle = this.detalle();
    if (!detalle || !this.puedeGestionar) return;
    this.guardar(
      this.api.seguir(this.departamento.slug, detalle.idReporte, {
        ...this.nuevoSeguimiento,
        idEstadoAnterior: detalle.idEstado,
      }),
      () => this.seleccion.next(detalle.idReporte),
    );
  }

  seleccionarArchivo(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;
    this.archivo = null;
    if (!archivo) return;
    if (
      !['image/png', 'image/jpeg', 'image/webp'].includes(archivo.type) ||
      archivo.size > 5 * 1024 * 1024 ||
      archivo.size === 0
    ) {
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
    this.guardar(
      this.api.subirEvidencia(
        this.departamento.slug,
        detalle.idReporte,
        this.archivo,
        this.descripcionEvidencia,
      ),
      () => {
        this.editandoEvidencia.set(null);
        this.seleccion.next(detalle.idReporte);
        this.notificar('Evidencia guardada.', true);
      },
      'Evidencia guardada.',
    );
  }

  registrarPunto(): void {
    if (!this.puedeGestionar) return;
    this.guardar(
      this.api.crearPunto(this.departamento.slug, { ...this.nuevoPunto }),
      () => {
        this.nuevoPunto = puntoVacio();
        this.mostrarNuevoPunto.set(false);
      },
      'Punto de reciclaje guardado.',
    );
  }

  editarEvidencia(idEvidencia: number): void {
    if (!this.guardando()) this.editandoEvidencia.set(idEvidencia);
  }

  cancelarEdicionEvidencia(): void {
    if (!this.guardando()) this.editandoEvidencia.set(null);
  }

  guardarDescripcionEvidencia(idEvidencia: number): void {
    const detalle = this.detalle();
    if (!detalle?.puedeAdjuntar) return;
    this.guardar(
      this.api.describirEvidencia(
        this.departamento.slug,
        detalle.idReporte,
        idEvidencia,
        this.descripcionesEvidencias[idEvidencia] ?? '',
      ),
      () => {
        this.editandoEvidencia.set(null);
        this.seleccion.next(detalle.idReporte);
        this.notificar('Evidencia guardada.', true);
      },
      'Descripción guardada.',
    );
  }

  private guardar(
    peticion: Observable<{ id: number }>,
    alGuardar: (r: { id: number }) => void,
    mensaje = 'Cambios guardados correctamente.',
  ): void {
    if (this.guardando() || this.cargando() || this.cargandoDetalle()) return;
    this.guardando.set(true);
    this.error.set('');
    this.mensaje.set('');
    peticion
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.guardando.set(false)),
      )
      .subscribe({
        next: (resultado) => {
          alGuardar(resultado);
          this.mensaje.set(mensaje);
          timer(5000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.mensaje.set(''));
          this.recargas.next();
        },
        error: (error) => this.informarError(error),
      });
  }

  private mensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0)
        return 'No se pudo conectar con el servidor. Comprueba que el backend esté iniciado.';
      if (typeof error.error?.mensaje === 'string') return error.error.mensaje;
    }
    return 'No fue posible completar la operación.';
  }

  private redirigirSiExpirada(error: unknown): void {
    if (error instanceof HttpErrorResponse && error.status === 401)
      void this.router.navigateByUrl('/login');
  }

  private informarError(error: unknown): void {
    this.error.set(this.mensajeError(error));
    this.redirigirSiExpirada(error);
  }
}
