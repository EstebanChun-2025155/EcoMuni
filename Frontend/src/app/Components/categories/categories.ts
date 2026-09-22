import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { ConsultaPagina } from '../departamentos-shared/consulta-pagina';
import type { CategoriaConsulta } from '../../models/consulta';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './categories.html',
  styleUrls: [
    '../departamentos-shared/consulta-pagina.css',
    './categories.css'
  ]
})
export class CategoriesComponent extends ConsultaPagina<CategoriaConsulta> {
  constructor() {
    super('categorias');
  }
}
