import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../Departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-peten',
  standalone: true,
  imports: [FormsModule],
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
      "imagen": "/Peten.png",
      "frase": "Protegiendo la biósfera maya y la gran selva tropical de Guatemala."
    });
  }
}