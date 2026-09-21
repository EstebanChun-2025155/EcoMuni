import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-san-marcos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './san-marcos.html',
  styleUrl: './san-marcos.css'
})
export class SanMarcos extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'san-marcos',
      nombre: 'San Marcos',
      cabecera: 'San Marcos',
      municipios: 30,
      imagen: '/san-marcos.jpg',
      frase: 'Desde los volcanes hasta la costa, proteger el ambiente fortalece el futuro de nuestras comunidades.'
    });
  }
}