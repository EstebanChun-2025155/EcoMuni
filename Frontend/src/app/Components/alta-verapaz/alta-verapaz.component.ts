import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-alta-verapaz',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './alta-verapaz.component.html',
  styleUrl: './alta-verapaz.component.css'
})
export class AltaVerapazComponent extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "alta-verapaz",
      "nombre": "Alta Verapaz",
      "cabecera": "Alta Verapaz",
      "municipios": 7,
      "imagen": "/Alta-Verapaz.png",
      "frase": "Tradición, naturaleza y comunidades comprometidas con un futuro más verde."
    });
  }
}
