import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService, DatosRegistro } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrls: ['../login/login.css', './register.css']
})
export class RegisterComponent {
    private readonly auth = inject(AuthService);

    datos: DatosRegistro = {
        nombres: '',
        apellidos: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        telefono: ''
    };

    readonly cargando = signal(false);
    readonly registrado = signal(false);
    readonly error = signal('');

    registrar(formulario: NgForm): void {
        if (this.cargando() || this.registrado()) return;
        this.error.set('');

        if (formulario.invalid) {
            formulario.control.markAllAsTouched();
            this.error.set('Completa correctamente los campos obligatorios.');
            return;
        }

        if (this.datos.contrasena !== this.datos.confirmarContrasena) {
            this.error.set('Las contraseñas no coinciden.');
            return;
        }

        if (new TextEncoder().encode(this.datos.contrasena).length > 72) {
            this.error.set('La contraseña no puede superar 72 bytes.');
            return;
        }

        this.cargando.set(true);

        this.auth.register({
            ...this.datos,
            nombres: this.datos.nombres.trim(),
            apellidos: this.datos.apellidos.trim(),
            correo: this.datos.correo.trim(),
            telefono: this.datos.telefono?.trim()
        }).pipe(
            finalize(() => this.cargando.set(false))
        ).subscribe({
            next: () => {
                formulario.resetForm();
                this.registrado.set(true);
            },
            error: (respuesta: HttpErrorResponse) => {
                const mensaje = respuesta.error?.mensaje;
                this.error.set(
                    respuesta.status === 0
                        ? 'No se pudo conectar con el servidor.'
                        : typeof mensaje === 'string'
                            ? mensaje
                            : 'No fue posible crear la cuenta.'
                );
            }
        });
    }
}