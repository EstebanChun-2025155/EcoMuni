import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-zacapa',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './zacapa.component.html',
  styleUrl: './zacapa.component.css',
})
export class Zacapa extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'zacapa',
      nombre: 'Zacapa',
      cabecera: 'Zacapa',
      municipios: 11,
      imagen: '/Zacapa.jpg',
      frase:
        'El uso responsable del agua y la protección de los ecosistemas benefician a toda la región.',
    });
  }
}
