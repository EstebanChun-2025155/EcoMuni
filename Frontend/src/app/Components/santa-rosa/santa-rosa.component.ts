import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-santa-rosa',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './santa-rosa.component.html',
  styleUrl: './santa-rosa.component.css',
})
export class SantaRosa extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'santa-rosa',
      nombre: 'Santa Rosa',
      cabecera: 'Cuilapa',
      municipios: 14,
      imagen: '/Santa-Rosa.jpg',
      frase: 'Cuidar nuestros bosques, ríos y playas es responsabilidad de todos.',
    });
  }
}
