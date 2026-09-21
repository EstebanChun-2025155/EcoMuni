import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartamentoPagina } from '../departamentos-shared/departamento-pagina';

@Component({
  selector: 'app-solola',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './solola.html',
  styleUrl: './solola.css'
})
export class Solola extends DepartamentoPagina {
  constructor() {
    super({
      slug: 'solola',
      nombre: 'Sololá',
      cabecera: 'Sololá',
      municipios: 19,
      imagen: '/solola.jpg',
      frase: 'El lago de Atitlán y sus ecosistemas dependen del compromiso de cada ciudadano.'
    });
  }
}