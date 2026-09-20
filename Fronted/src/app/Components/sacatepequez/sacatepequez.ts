import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-sacatepequez',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sacatepequez.html',
  styleUrl: './sacatepequez.css'
})
export class Sacatepequez extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "sacatepequez",
      "nombre": "Sacatepéquez",
      "cabecera": "Antigua Guatemala",
      "municipios": 16,
      "imagen": "/Sacatepequez.png",
      "frase": "Tierra de historia colonial y riqueza cultural, comprometida con la protección de sus paisajes y la gestión ambiental."
    });
  }
}