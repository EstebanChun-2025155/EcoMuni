import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavbarComponent } from '../navbar/navbar.component';
import { SeguimientoService, type SeguimientoReporte } from '../../services/seguimiento.service';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.css',
})
export class SeguimientoComponent {
  private readonly servicio = inject(SeguimientoService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly seguimientos = signal<SeguimientoReporte[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  private readonly colores = ['#6B7F3A', '#8B7B5A', '#D7D2C7', '#4A3A2A', '#1F3B2C'];

  readonly porEstado = computed(() => {
    const conteos = new Map<string, number>();
    for (const item of this.seguimientos()) {
      conteos.set(item.estado, (conteos.get(item.estado) ?? 0) + 1);
    }
    return [...conteos].map(([estado, total]) => ({ estado, total }));
  });

  constructor() {
    this.servicio
      .listar()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => {
          this.seguimientos.set(datos);
          this.cargando.set(false);
        },
        error: (error: { error?: { mensaje?: string } }) => {
          this.error.set(
            error.error?.mensaje ?? 'No se pudo cargar el seguimiento. Inténtalo nuevamente.',
          );
          this.cargando.set(false);
        },
      });
  }

  colorEstado(estado: string): string {
    const posicion = this.porEstado().findIndex((dato) => dato.estado === estado);
    return this.colores[(posicion < 0 ? 0 : posicion) % this.colores.length];
  }

  verReporte(slug: string): void {
    void this.router.navigateByUrl('/departamentos/' + slug);
  }
}
