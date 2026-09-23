import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-quetzaltenango',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './quetzaltenango.component.html',
  styleUrl: './quetzaltenango.component.css',
})
export class Quetzaltenango extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'quetzaltenango',
      nombre: 'Quetzaltenango',
      cabecera: 'Quetzaltenango',
      municipios: 24,
      imagen: '/Quetzaltenango.jpg',
      frase:
        'Cuna de cultura, valles y volcanes unidos en pro del desarrollo sostenible y la conservación ambiental.',
    });
  }
}
