import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-escuintla',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './escuintla.component.html',
  styleUrl: './escuintla.component.css'
})
export class EscuintlaComponent extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "escuintla",
      "nombre": "Escuintla",
      "cabecera": "Escuintla",
      "municipios": 7,
      "imagen": "/Escuintla.png",
      "frase": "Tradición, naturaleza y comunidades comprometidas con un futuro más verde."
    });
  }
}
