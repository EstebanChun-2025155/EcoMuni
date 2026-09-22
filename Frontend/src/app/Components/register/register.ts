import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService, DatosRegistro } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrls: ['../login/login.css', './register.css']
})
export class RegisterComponent implements OnDestroy {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

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
    readonly notificacion = signal('');
    readonly notificacionVisible = signal(false);

    private temporizador?: ReturnType<typeof setTimeout>;

    ngOnDestroy(): void {
        if (this.temporizador) clearTimeout(this.temporizador);
    }

    private notificar(texto: string): void {
        this.notificacion.set(texto);
        this.notificacionVisible.set(true);
        if (this.temporizador) clearTimeout(this.temporizador);
        this.temporizador = setTimeout(() => this.notificacionVisible.set(false), 4000);
    }

    private faltanCampos(): void {
        this.notificar('Completa correctamente los campos obligatorios.');
    }

    registrar(formulario: NgForm): void {
        if (this.cargando() || this.registrado()) return;

        if (formulario.invalid) {
            formulario.control.markAllAsTouched();
        }

        const nombres = this.datos.nombres.trim();
        const apellidos = this.datos.apellidos.trim();
        const correo = this.datos.correo.trim().toLowerCase();
        const telefono = (this.datos.telefono ?? '').trim();

        if (!nombres) { this.faltanCampos(); return; }
        if (/\d/.test(nombres)) { this.notificar('El nombre debe ser texto, no números.'); return; }

        if (!apellidos) { this.faltanCampos(); return; }
        if (/\d/.test(apellidos)) { this.notificar('El apellido debe ser texto, no números.'); return; }

        if (!correo) { this.faltanCampos(); return; }
        if (!/^[^\s@]+@gmail\.com$/.test(correo)) { this.notificar('Correo inválido.'); return; }

        if (telefono && !/^\d{8}$/.test(telefono)) { this.notificar('Teléfono inválido.'); return; }

        if (!this.datos.contrasena) { this.faltanCampos(); return; }
        if (this.datos.contrasena.length < 8) {
            this.notificar('La contraseña debe tener mínimo 8 caracteres.');
            return;
        }

        if (!this.datos.confirmarContrasena) { this.faltanCampos(); return; }
        if (this.datos.contrasena !== this.datos.confirmarContrasena) {
            this.notificar('Las contraseñas no coinciden.');
            return;
        }

        if (new TextEncoder().encode(this.datos.contrasena).length > 72) {
            this.notificar('La contraseña no puede superar 72 bytes.');
            return;
        }

        if (formulario.invalid) { this.faltanCampos(); return; }

        this.cargando.set(true);

        this.auth.register({
            ...this.datos,
            nombres,
            apellidos,
            correo: this.datos.correo.trim(),
            telefono: this.datos.telefono?.trim()
        }).pipe(
            finalize(() => this.cargando.set(false))
        ).subscribe({
            next: () => {
                formulario.resetForm();
                this.registrado.set(true);
                void this.router.navigate(['/login'], { state: { registro: 'exitoso' } });
            },
            error: (respuesta: HttpErrorResponse) => {
                const mensaje = respuesta.error?.mensaje;
                this.notificar(
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
