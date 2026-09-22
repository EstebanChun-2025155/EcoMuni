import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-zacapa',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './zacapa.html',
  styleUrl: './zacapa.css'
})
export class Zacapa extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'zacapa',
      nombre: 'Zacapa',
      cabecera: 'Zacapa',
      municipios: 11,
      imagen: '/zacapa.jpg',
      frase: 'El uso responsable del agua y la protección de los ecosistemas benefician a toda la región.'
    });
  }
}