import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ConsultaPagina } from '../departamentos-shared/consulta-pagina';
import { DepartamentoService } from '../../services/departamento.service';
import type { EvidenciaConsulta } from '../../models/consulta';

@Component({
  selector: 'app-evidences',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './evidences.component.html',
  styleUrls: ['../departamentos-shared/consulta-pagina.css', './evidences.component.css'],
})
export class EvidencesComponent extends ConsultaPagina<EvidenciaConsulta> {
  readonly api = inject(DepartamentoService);

  constructor() {
    super('evidencias');
  }
}
