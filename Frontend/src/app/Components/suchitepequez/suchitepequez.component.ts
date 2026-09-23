import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-suchitepequez',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './suchitepequez.component.html',
  styleUrl: './suchitepequez.component.css',
})
export class Suchitepequez extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'suchitepequez',
      nombre: 'Suchitepéquez',
      cabecera: 'Mazatenango',
      municipios: 21,
      imagen: '/Suchitepequez.jpg',
      frase: 'La conservación de nuestros recursos naturales impulsa el desarrollo sostenible.',
    });
  }
}
