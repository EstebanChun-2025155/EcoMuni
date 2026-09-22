import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { ConsultaPagina } from '../departamentos-shared/consulta-pagina';
import type { UbicacionConsulta } from '../../models/consulta';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './ubicaciones.html',
  styleUrls: [
    '../departamentos-shared/consulta-pagina.css',
    './ubicaciones.css'
  ]
})
export class UbicacionesComponent extends ConsultaPagina<UbicacionConsulta> {
  constructor() {
    super('ubicaciones');
  }
}
