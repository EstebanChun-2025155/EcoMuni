import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ConsultaPagina } from '../departamentos-shared/consulta-pagina';
import type { UbicacionConsulta } from '../../models/consulta';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css'],
})
export class UbicacionesComponent extends ConsultaPagina<UbicacionConsulta> {
  constructor() {
    super('ubicaciones');
  }

  readonly enPagina = computed(() => this.datos().items.length);

  readonly conZona = computed(
    () => this.datos().items.filter((item) => item.zona !== null && item.zona !== '').length,
  );

  readonly departamentosVistos = computed(
    () => new Set(this.datos().items.map((item) => item.departamento)).size,
  );
}
