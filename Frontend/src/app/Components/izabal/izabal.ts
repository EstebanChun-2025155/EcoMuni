import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-izabal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './izabal.html',
  styleUrl: './izabal.css'
})
export class Izabal extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "izabal",
      "nombre": "Izabal",
      "cabecera": "Puerto Barrios",
      "municipios": 5,
      "imagen": "/Izabal.png",
      "frase": "Entre el lago, el mar y la selva, cada acción ayuda a proteger un ecosistema único."
});
  }
}
