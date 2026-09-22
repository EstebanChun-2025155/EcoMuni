import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-jutiapa',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './jutiapa.html',
  styleUrl: './jutiapa.css'
})
export class Jutiapa extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "jutiapa",
      "nombre": "Jutiapa",
      "cabecera": "Jutiapa",
      "municipios": 17,
      "imagen": "/Jutiapa.png",
      "frase": "Participación ciudadana para mantener espacios públicos más limpios y responsables."
});
  }
}
