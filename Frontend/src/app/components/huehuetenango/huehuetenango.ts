import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-huehuetenango',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './huehuetenango.html',
  styleUrl: './huehuetenango.css'
})
export class Huehuetenango extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "huehuetenango",
      "nombre": "Huehuetenango",
      "cabecera": "Huehuetenango",
      "municipios": 33,
      "imagen": "/Huehuetenango.png",
      "frase": "Comunidades de montaña comprometidas con el cuidado de sus recursos naturales."
});
  }
}
