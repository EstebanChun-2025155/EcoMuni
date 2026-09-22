import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-cdguatemala',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
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
