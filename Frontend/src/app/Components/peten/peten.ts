import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-peten',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './peten.html',
  styleUrl: './peten.css'
})
export class Peten extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "peten",
      "nombre": "Petén",
      "cabecera": "Flores",
      "municipios": 14,
      "imagen": "/Peten.jpg",
      "frase": "Protegiendo la biósfera maya y la gran selva tropical de Guatemala."
    });
  }
}
