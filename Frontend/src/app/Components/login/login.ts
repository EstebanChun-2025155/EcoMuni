import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  correo = '';
  contrasena = '';

  readonly cargando = signal(false);
  readonly error = signal('');

  ingresar(formulario: NgForm): void {
    if (this.cargando()) return;

    this.error.set('');

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      this.error.set('Ingresa un correo válido y tu contraseña.');
      return;
    }

    this.cargando.set(true);

    this.auth.login(this.correo.trim(), this.contrasena)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: () => {
          this.contrasena = '';
          void this.router.navigateByUrl('/home', { replaceUrl: true });
        },
        error: (respuesta: HttpErrorResponse) => {
          this.contrasena = '';

          const mensaje =
            respuesta.status === 0
              ? 'No se pudo conectar con el servidor.'
              : respuesta.error?.mensaje;

          this.error.set(
            typeof mensaje === 'string'
              ? mensaje
              : 'No fue posible iniciar sesión. Inténtalo nuevamente.'
          );
        }
      });
  }
}