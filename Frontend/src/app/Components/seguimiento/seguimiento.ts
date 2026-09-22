import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  constructor() {
    this.servicio.listar().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: datos => {
        this.seguimientos.set(datos);
        this.cargando.set(false);
      },
      error: (error: { error?: { mensaje?: string } }) => {
        this.error.set(error.error?.mensaje ?? 'No se pudo cargar el seguimiento. Inténtalo nuevamente.');
        this.cargando.set(false);
      }
    });
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
}
