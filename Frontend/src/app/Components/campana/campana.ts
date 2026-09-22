import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, EMPTY, catchError, finalize, startWith, switchMap } from 'rxjs';
import { CampanaService } from '../../services/campana.service';
import type { CampanaRegistro, DatosCampana, EstadoCampana, FiltrosCampana, PanelCampanas, UbicacionCampana } from '../../models/campana';

function campanaVacia(): DatosCampana {
  return { titulo: '', descripcion: '', organizador: '', fechaInicio: '', fechaFin: '', imagenUrl: '', estado: 'borrador', ubicacion: null };
}
function lugarVacio(): UbicacionCampana {
  return { departamento: '', municipio: '', zona: '', direccion: '', referencia: '' };
}

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent],
  selector: 'app-campana',
  styleUrl: './campana.css',
  templateUrl: './campana.html',
})
export class Campana {
  private readonly api = inject(CampanaService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly recargas = new Subject<void>();
  readonly panel = signal<PanelCampanas | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly mostrarFormulario = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');
  readonly estados: EstadoCampana[] = ['borrador', 'publicada', 'finalizada', 'cancelada'];
  filtros: FiltrosCampana = { pagina: 1, busqueda: '', estado: '' };
  formulario = campanaVacia();
  lugar = lugarVacio();
  conUbicacion = false;
  editando: number | null = null;

  constructor() {
    this.recargas.pipe(
      startWith(undefined),
      switchMap(() => {
        this.cargando.set(true);
        this.error.set('');
        return this.api.listar({ ...this.filtros }).pipe(
          catchError(error => { this.informarError(error); return EMPTY; }),
          finalize(() => this.cargando.set(false))
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(panel => this.panel.set(panel));
  }

  get puedeGestionar(): boolean { return this.panel()?.puedeGestionar ?? false; }
  get paginas(): number {
    const panel = this.panel();
    return panel ? Math.max(1, Math.ceil(panel.total / panel.porPagina)) : 1;
  }
  get estadosVisibles(): EstadoCampana[] {
    return this.puedeGestionar ? this.estados : ['publicada', 'finalizada'];
  }
  get fechasValidas(): boolean {
    return !!this.formulario.fechaInicio && !!this.formulario.fechaFin && this.formulario.fechaFin >= this.formulario.fechaInicio;
  }
  recargar(): void { if (!this.guardando()) this.recargas.next(); }
  buscar(): void {
    if (this.guardando()) return;
    this.filtros.pagina = 1;
    this.recargar();
  }
  cambiarPagina(delta: number): void {
    const pagina = this.filtros.pagina + delta;
    if (this.cargando() || this.guardando() || pagina < 1 || pagina > this.paginas) return;
    this.filtros.pagina = pagina;
    this.recargar();
  }
  abrirFormulario(campana?: CampanaRegistro): void {
    if (!this.puedeGestionar || this.guardando() || this.cargando()) return;
    this.editando = campana?.idCampana ?? null;
    this.formulario = campana ? {
      titulo: campana.titulo, descripcion: campana.descripcion, organizador: campana.organizador,
      fechaInicio: campana.fechaInicio, fechaFin: campana.fechaFin, imagenUrl: campana.imagenUrl ?? '',
      estado: campana.estado, ubicacion: campana.ubicacion ? { ...campana.ubicacion } : null
    } : campanaVacia();
    this.conUbicacion = !!campana?.ubicacion;
    this.lugar = campana?.ubicacion ? { ...campana.ubicacion } : lugarVacio();
    this.error.set('');
    this.mensaje.set('');
    this.mostrarFormulario.set(true);
  }
  cerrarFormulario(): void {
    if (!this.guardando()) this.mostrarFormulario.set(false);
  }
  guardar(): void {
    if (this.guardando() || this.cargando() || !this.puedeGestionar || !this.fechasValidas) return;
    this.guardando.set(true);
    this.error.set('');
    const datos: DatosCampana = { ...this.formulario, ubicacion: this.conUbicacion ? { ...this.lugar } : null };
    this.api.guardar(datos, this.editando).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.guardando.set(false))
    ).subscribe({
      next: () => {
        this.mostrarFormulario.set(false);
        this.formulario = campanaVacia();
        this.lugar = lugarVacio();
        this.editando = null;
        this.conUbicacion = false;
        this.mensaje.set('Campaña guardada correctamente.');
        this.filtros = { pagina: 1, busqueda: '', estado: '' };
        this.recargas.next();
      },
      error: error => this.informarError(error)
    });
  }
  fechaLegible(fecha: string): string { return fecha.split('-').reverse().join('/'); }
  nombreEstado(estado: EstadoCampana): string {
    return { borrador: 'Borrador', publicada: 'Publicada', finalizada: 'Finalizada', cancelada: 'Cancelada' }[estado];
  }
  imagenSegura(url: string | null): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return url.startsWith('/') && !url.startsWith('//') ? url : '';
  }
  private informarError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) void this.router.navigateByUrl('/login');
      if (error.status === 0) { this.error.set('No se pudo conectar con el servidor. Comprueba que el backend esté iniciado.'); return; }
      if (typeof error.error?.mensaje === 'string') { this.error.set(error.error.mensaje); return; }
    }
    this.error.set('No fue posible completar la operación. Inténtalo nuevamente.');
  }
}
