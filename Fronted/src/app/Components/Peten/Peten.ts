import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Change 'Departamentos-shared' to lowercase 'departamentos-shared'
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-Peten',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './Peten.html',
  styleUrl: './Peten.css'
})
export class Peten extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "peten",
      "nombre": "Petén",
      "cabecera": "Flores",
      "municipios": 14,
      "imagen": "/Peten.png",
      "frase": "Protegiendo la biósfera maya y la gran selva tropical de Guatemala."
    });
  }
}