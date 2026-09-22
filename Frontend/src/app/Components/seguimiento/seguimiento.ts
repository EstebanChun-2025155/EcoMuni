import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar';
import { SeguimientoService, type SeguimientoReporte } from '../../services/seguimiento.service';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.css'
})
export class SeguimientoComponent {
  private readonly servicio = inject(SeguimientoService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly seguimientos = signal<SeguimientoReporte[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  /** Solo muestra el botón Scroll cuando la página realmente puede desplazarse. */
  readonly hayScroll = signal(false);

  constructor() {
    this.servicio.listar().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: datos => {
        this.seguimientos.set(datos);
        this.cargando.set(false);
        this.programarCalculoScroll();
      },
      error: (error: { error?: { mensaje?: string } }) => {
        this.error.set(error.error?.mensaje ?? 'No se pudo cargar el seguimiento. Inténtalo nuevamente.');
        this.cargando.set(false);
        this.programarCalculoScroll();
      }
    });

    fromEvent(window, 'resize').pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.hayScroll.set(this.puedeDesplazarse()));
  }

  verReporte(slug: string): void {
    void this.router.navigateByUrl('/departamentos/' + slug);
  }

  onScrollDown(): void {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }

  /** Recalcula tras un ciclo de render para que el DOM ya tenga las tarjetas. */
  private programarCalculoScroll(): void {
    setTimeout(() => this.hayScroll.set(this.puedeDesplazarse()), 0);
  }

  private puedeDesplazarse(): boolean {
    return document.documentElement.scrollHeight > window.innerHeight + 40;
  }
}
