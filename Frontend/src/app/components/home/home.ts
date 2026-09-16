import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

interface Departamento {
    slug: string;
    nombre: string;
    imagen?: string;
}

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
    readonly menuAbierto = signal(true);

    readonly departamentos: readonly Departamento[] = [
        { slug: 'alta-verapaz', nombre: 'Alta Verapaz' },
        { slug: 'baja-verapaz', nombre: 'Baja Verapaz' },
        { slug: 'chimaltenango', nombre: 'Chimaltenango' },
        { slug: 'chiquimula', nombre: 'Chiquimula' },
        { slug: 'el-progreso', nombre: 'El Progreso' },
        { slug: 'escuintla', nombre: 'Escuintla' },
        { slug: 'guatemala', nombre: 'Guatemala' },
        { slug: 'huehuetenango', nombre: 'Huehuetenango' },
        { slug: 'izabal', nombre: 'Izabal' },
        { slug: 'jalapa', nombre: 'Jalapa' },
        { slug: 'jutiapa', nombre: 'Jutiapa' },
        { slug: 'peten', nombre: 'Petén' },
        { slug: 'quetzaltenango', nombre: 'Quetzaltenango' },
        { slug: 'quiche', nombre: 'Quiché' },
        { slug: 'retalhuleu', nombre: 'Retalhuleu' },
        { slug: 'sacatepequez', nombre: 'Sacatepéquez' },
        { slug: 'san-marcos', nombre: 'San Marcos' },
        { slug: 'santa-rosa', nombre: 'Santa Rosa' },
        { slug: 'solola', nombre: 'Sololá' },
        { slug: 'suchitepequez', nombre: 'Suchitepéquez' },
        { slug: 'totonicapan', nombre: 'Totonicapán' },
        { slug: 'zacapa', nombre: 'Zacapa' }
    ];

    alternarMenu(): void {
        this.menuAbierto.update(abierto => !abierto);
    }

    volverArriba(): void {
        const reducirMovimiento = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: reducirMovimiento ? 'auto' : 'smooth'
        });
    }

    cerrarSesion(): void {
        if (this.cerrando()) return;

        this.cerrando.set(true);
        this.error.set('');

        this.auth.logout()
            .pipe(finalize(() => this.cerrando.set(false)))
            .subscribe({
                next: () => {
                    void this.router.navigateByUrl('/login', {
                        replaceUrl: true
                    });
                },
                error: () => {
                    this.error.set(
                        'No se pudo cerrar la sesión. Comprueba la conexión e inténtalo otra vez.'
                    );
                }
            });
    }
}