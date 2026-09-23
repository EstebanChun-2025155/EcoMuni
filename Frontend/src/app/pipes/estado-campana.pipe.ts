import { Pipe, PipeTransform } from '@angular/core';
import type { EstadoCampana } from '../models/campana';

@Pipe({ name: 'estadoCampana', standalone: true })
export class EstadoCampanaPipe implements PipeTransform {
  transform(estado: EstadoCampana): string {
    return {
      borrador: 'Borrador',
      publicada: 'Publicada',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    }[estado];
  }
}
