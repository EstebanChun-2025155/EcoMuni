import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-chimaltenango',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chimaltenango.component.html',
  styleUrl: './chimaltenango.component.css'
})
export class ChimaltenangoComponent extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "chimaltenango",
      "nombre": "Chimaltenango",
      "cabecera": "Chimaltenango",
      "municipios": 7,
      "imagen": "/Chimaltenango.png",
      "frase": "Tradición, naturaleza y comunidades comprometidas con un futuro más verde."
    });
  }
}
