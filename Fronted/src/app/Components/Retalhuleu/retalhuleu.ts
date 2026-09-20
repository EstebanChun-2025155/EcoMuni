import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-retalhuleu',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './retalhuleu.html',
  styleUrl: './retalhuleu.css'
})
export class Retalhuleu extends DepartamentoPagina {
  constructor() {
    super({
      "slug": "retalhuleu",
      "nombre": "Retalhuleu",
      "cabecera": "Retalhuleu",
      "municipios": 9,
      "imagen": "/Retalhuleu.png",
      "frase": "Capital del mundo cálido, donde la riqueza natural y el desarrollo sostenible impulsan la conservación ambiental."
    });
  }
}