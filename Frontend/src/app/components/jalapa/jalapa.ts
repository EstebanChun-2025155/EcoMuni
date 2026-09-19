import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-jalapa',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './jalapa.html',
  styleUrl: './jalapa.css'
})
export class Jalapa extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "jalapa",
      "nombre": "Jalapa",
      "cabecera": "Jalapa",
      "municipios": 7,
      "imagen": "/Jalapa.png",
      "frase": "Tradición, naturaleza y comunidades comprometidas con un futuro más verde."
});
  }
}
