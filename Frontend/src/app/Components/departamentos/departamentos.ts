import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { AuthService } from '../../services/auth.service';

interface Departamento {
    slug: string;
    nombre: string;
    imagen?: string;
}

@Component({
    selector: 'app-departamentos',
    standalone: true,
    imports: [CommonModule, NavbarComponent],
    templateUrl: './departamentos.html',
    styleUrl: './departamentos.css'
})
export class DepartamentosComponent {
    private readonly router = inject(Router);
    private readonly auth = inject(AuthService);

    /** Nombre real de la sesión activa (lo carga el authGuard). */
    readonly nombreUsuario = computed(() => {
        const usuario = this.auth.usuario();
        return usuario ? `${usuario.nombres} ${usuario.apellidos}` : '';
    });

    readonly departamentos: readonly Departamento[] = [
        { slug: 'alta-verapaz', nombre: 'Alta Verapaz', imagen: '/Alta-Verapaz.png' },
        { slug: 'baja-verapaz', nombre: 'Baja Verapaz' },
        { slug: 'chimaltenango', nombre: 'Chimaltenango' },
        { slug: 'chiquimula', nombre: 'Chiquimula' },
        { slug: 'el-progreso', nombre: 'El Progreso' },
        { slug: 'escuintla', nombre: 'Escuintla', imagen: '/Escuintla.png' },
        { slug: 'guatemala', nombre: 'Guatemala', imagen: '/Capital.jpg' },
        { slug: 'huehuetenango', nombre: 'Huehuetenango', imagen: '/Huehuetenango.png' },
        { slug: 'izabal', nombre: 'Izabal', imagen: '/Izabal.png' },
        { slug: 'jalapa', nombre: 'Jalapa', imagen: '/Jalapa.png' },
        { slug: 'jutiapa', nombre: 'Jutiapa', imagen: '/Jutiapa.png' },
        { slug: 'peten', nombre: 'Petén', imagen: '/Peten.jpg' },
        { slug: 'quetzaltenango', nombre: 'Quetzaltenango', imagen: '/Quetzaltenango.jpg' },
        { slug: 'quiche', nombre: 'Quiché', imagen: '/Quiche.jpeg' },
        { slug: 'retalhuleu', nombre: 'Retalhuleu', imagen: '/Retalhuleu.jpg' },
        { slug: 'sacatepequez', nombre: 'Sacatepéquez', imagen: '/Sacatepeques.jpg' },
        { slug: 'san-marcos', nombre: 'San Marcos' },
        { slug: 'santa-rosa', nombre: 'Santa Rosa' },
        { slug: 'solola', nombre: 'Sololá' },
        { slug: 'suchitepequez', nombre: 'Suchitepéquez' },
        { slug: 'totonicapan', nombre: 'Totonicapán' },
        { slug: 'zacapa', nombre: 'Zacapa' }
    ];

    onNavigate(path: string): void {
        void this.router.navigateByUrl(path);
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
}
