import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-baja-verapaz',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './baja-verapaz.component.html',
  styleUrl: './baja-verapaz.component.css'
})
export class BajaVerapazComponent extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "baja-verapaz",
      "nombre": "Baja Verapaz",
      "cabecera": "Baja Verapaz",
      "municipios": 7,
      "imagen": "/Baja-Verapaz.png",
      "frase": "Tradición, naturaleza y comunidades comprometidas con un futuro más verde."
    });
  }
}
