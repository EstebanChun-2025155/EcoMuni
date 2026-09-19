import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-cdguatemala',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cdguatemala.html',
  styleUrl: './cdguatemala.css'
})
export class CDGuatemala extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "guatemala",
      "nombre": "Guatemala",
      "cabecera": "Ciudad de Guatemala",
      "municipios": 17,
      "imagen": "/Capital.jpg",
      "frase": "Una ciudad que avanza hacia comunidades más limpias y sostenibles."
});
  }
}
