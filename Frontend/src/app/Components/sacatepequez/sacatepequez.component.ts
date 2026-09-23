import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-sacatepequez',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './sacatepequez.component.html',
  styleUrl: './sacatepequez.component.css',
})
export class Sacatepequez extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'sacatepequez',
      nombre: 'Sacatepéquez',
      cabecera: 'Antigua Guatemala',
      municipios: 16,
      imagen: '/Sacatepeques.jpg',
      frase:
        'Tierra de historia colonial y riqueza cultural, comprometida con la protección de sus paisajes y la gestión ambiental.',
    });
  }
}
