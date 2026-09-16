import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly cerrando = signal(false);
  readonly error = signal('');

  cerrarSesion(): void {
    if (this.cerrando()) return;

    this.cerrando.set(true);
    this.error.set('');

    this.auth.logout()
      .pipe(finalize(() => this.cerrando.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/login', { replaceUrl: true });
        },
        error: () => {
          this.error.set(
            'No se pudo cerrar la sesión. Comprueba la conexión e inténtalo otra vez.'
          );
        }
      });
  }
}