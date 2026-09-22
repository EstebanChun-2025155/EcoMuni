import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-chiquimula',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './chiquimula.component.html',
  styleUrl: './chiquimula.component.css'
})
export class ChiquimulaComponent extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "chiquimula",
      "nombre": "Chiquimula",
      "cabecera": "Chiquimula",
      "municipios": 7,
      "imagen": "/Chiquimula.jpg",
      "frase": "Tradición, naturaleza y comunidades comprometidas con un futuro más verde."
    });
  }
}
