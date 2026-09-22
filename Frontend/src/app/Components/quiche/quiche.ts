import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-quiche',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './quiche.html',
  styleUrl: './quiche.css'
})
export class Quiche extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "quiche",
      "nombre": "Quiché",
      "cabecera": "Santa Cruz del Quiché",
      "municipios": 21,
      "imagen": "/Quiche.jpeg",
      "frase": "Tierra de historia, tradiciones sagradas y comunidades unidas por la protección de sus bosques y valles."
    });
  }
}
