import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-totonicapan',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './totonicapan.component.html',
  styleUrl: './totonicapan.component.css',
})
export class Totonicapan extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'totonicapan',
      nombre: 'Totonicapán',
      cabecera: 'Totonicapán',
      municipios: 8,
      imagen: '/Totonicapan.jpg',
      frase: 'Los bosques comunales son un ejemplo de conservación y trabajo conjunto.',
    });
  }
}
