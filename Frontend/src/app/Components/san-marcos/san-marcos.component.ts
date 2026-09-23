import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-san-marcos',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './san-marcos.component.html',
  styleUrl: './san-marcos.component.css',
})
export class SanMarcos extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'san-marcos',
      nombre: 'San Marcos',
      cabecera: 'San Marcos',
      municipios: 30,
      imagen: '/San-Marcos-La-Laguna.png',
      frase:
        'Desde los volcanes hasta la costa, proteger el ambiente fortalece el futuro de nuestras comunidades.',
    });
  }
}
