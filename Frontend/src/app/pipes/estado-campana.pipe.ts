import { Pipe, PipeTransform } from '@angular/core';
import type { EstadoCampana } from '../models/campana';

/**
 * Nombre legible de un estado de campaña.
 *
 * Pipe puro: el diccionario se consulta una sola vez por valor distinto,
 * en lugar de reconstruirse en cada detección de cambios como ocurriría
 * con un método invocado desde la plantilla.
 */
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
