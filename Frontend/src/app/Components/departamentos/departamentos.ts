import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';

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
