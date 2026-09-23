import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-jutiapa',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './jutiapa.component.html',
  styleUrl: './jutiapa.component.css',
})
export class Jutiapa extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'jutiapa',
      nombre: 'Jutiapa',
      cabecera: 'Jutiapa',
      municipios: 17,
      imagen: '/Jutiapa.png',
      frase: 'Participación ciudadana para mantener espacios públicos más limpios y responsables.',
    });
  }
}
