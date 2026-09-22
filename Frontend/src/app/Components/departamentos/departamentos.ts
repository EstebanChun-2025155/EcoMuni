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
        { slug: 'baja-verapaz', nombre: 'Baja Verapaz', imagen: '/Baja-Verapaz.jpg' },
        { slug: 'chimaltenango', nombre: 'Chimaltenango', imagen: '/Chimaltenango.jpg' },
        { slug: 'chiquimula', nombre: 'Chiquimula', imagen: '/Chiquimula.jpg' },
        { slug: 'el-progreso', nombre: 'El Progreso', imagen: '/El-Progreso.jpg' },
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
        { slug: 'san-marcos', nombre: 'San Marcos', imagen: '/San-Marcos-La-Laguna.png' },
        { slug: 'santa-rosa', nombre: 'Santa Rosa', imagen: '/Santa-Rosa.jpg' },
        { slug: 'solola', nombre: 'Sololá', imagen: '/Solola.jpg' },
        { slug: 'suchitepequez', nombre: 'Suchitepéquez', imagen: '/Suchitepequez.jpg' },
        { slug: 'totonicapan', nombre: 'Totonicapán', imagen: '/Totonicapan.jpg' },
        { slug: 'zacapa', nombre: 'Zacapa', imagen: '/Zacapa.jpg' }
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
