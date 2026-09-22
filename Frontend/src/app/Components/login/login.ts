import { Component, inject, OnDestroy, signal } from '@angular/core';
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
export class LoginComponent implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  correo = '';
  contrasena = '';

  readonly cargando = signal(false);
  readonly notificacion = signal('');
  readonly notificacionExito = signal(false);
  readonly notificacionVisible = signal(false);

  private temporizador?: ReturnType<typeof setTimeout>;

  constructor() {
    const estado = this.router.getCurrentNavigation()?.extras.state;
    if (estado?.['registro'] === 'exitoso') {
      this.notificar('Cuenta creada correctamente.', true);
    }
  }

  ngOnDestroy(): void {
    if (this.temporizador) clearTimeout(this.temporizador);
  }

  private notificar(texto: string, exito = false): void {
    this.notificacion.set(texto);
    this.notificacionExito.set(exito);
    this.notificacionVisible.set(true);
    if (this.temporizador) clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.notificacionVisible.set(false), 4000);
  }

  ingresar(formulario: NgForm): void {
    if (this.cargando()) return;

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
    }

    const correo = this.correo.trim();
    if (!correo || !this.contrasena) {
      this.notificar('Completa correctamente los campos obligatorios.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      this.notificar('Correo inválido.');
      return;
    }
    if (formulario.invalid) {
      this.notificar('Completa correctamente los campos obligatorios.');
      return;
    }

    this.cargando.set(true);

    this.auth.login(correo, this.contrasena)
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

          this.notificar(
            typeof mensaje === 'string'
              ? mensaje
              : 'No fue posible iniciar sesión. Inténtalo nuevamente.'
          );
        }
      });
  }
}
