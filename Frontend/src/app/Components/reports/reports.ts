import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { ConsultaPagina } from '../departamentos-shared/consulta-pagina';
import type { ReporteConsulta } from '../../models/consulta';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './reports.html',
  styleUrls: [
    '../departamentos-shared/consulta-pagina.css',
    './reports.css'
  ]
})
export class ReportsComponent extends ConsultaPagina<ReporteConsulta> {
  constructor() {
    super('reportes');
  }
}
