import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-el-progreso',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './el-progreso.component.html',
  styleUrl: './el-progreso.component.css'
})
export class ElProgresoComponent extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "el-progreso",
      "nombre": "El Progreso",
      "cabecera": "El Progreso",
      "municipios": 7,
      "imagen": "/El-Progreso.jpg",
      "frase": "Tradición, naturaleza y comunidades comprometidas con un futuro más verde."
    });
  }
}
