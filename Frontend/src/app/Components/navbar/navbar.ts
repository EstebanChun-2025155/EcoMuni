import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export type VistaNavbar = 'inicio' | 'reportes' | '';

interface EnlaceNavbar {
  name: string;
  path: string;
}

/**
 * Barra de navegación compartida por home, departamentos
 * y las vistas de detalle de cada departamento.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Indica qué pestaña se resalta en blanco según la vista actual. */
  readonly activa = input<VistaNavbar>('');

  readonly cerrando = signal(false);
  readonly error = signal('');

  readonly enlaces: readonly EnlaceNavbar[] = [
    { name: 'Campañas', path: '/campana' },
    { name: 'Seguimiento', path: '/seguimiento' },
    { name: 'Reportes', path: '/departamentos' },
    { name: 'Acerca de', path: '/acerca-de' },
    { name: 'Ubicaciones', path: '/ubicaciones' },
    { name: 'Ayuda', path: '/ayuda' }
  ];

  cerrarSesion(): void {
    if (this.cerrando()) return;
    this.cerrando.set(true);
    this.error.set('');

    this.auth.logout().pipe(
      finalize(() => this.cerrando.set(false))
    ).subscribe({
      next: () => void this.router.navigateByUrl('/login', { replaceUrl: true }),
      error: () => this.error.set('No se pudo cerrar la sesión. Inténtalo de nuevo.')
    });
  }
}
